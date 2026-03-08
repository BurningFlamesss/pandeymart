import { Check, CheckCircle2, ChevronDown, Pencil, Star, Trash2, X, XCircle } from 'lucide-react';
import { useOptimistic, useState } from 'react';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import { ProductSheet } from './ProductSheet';
import type { AdminPanelOrder, AdminPanelProduct, AdminPanelUser } from '@/server/functions/AdminFunctions';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { createProduct } from '@/server/functions/createProduct';
import { updateProduct } from '@/server/functions/updateProduct';
import { parseCustomizations } from '@/utils/parseCustomization';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { deleteOrders, deleteProducts, deleteUsers, updateOrderStatus, updateProductStock, updateUserVerification } from '@/server/functions/AdminFunctions';

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type ProductStatus = 'FEATURED' | 'ACTIVE' | 'INACTIVE';

const PAYMENT_STATUSES: Array<PaymentStatus> = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const ORDER_STATUSES: Array<OrderStatus> = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PRODUCT_STATUSES: Array<ProductStatus> = ['FEATURED', 'ACTIVE', 'INACTIVE'];

const paymentStatusColors: Record<PaymentStatus, string> = {
    PENDING: 'text-yellow-700 bg-yellow-100',
    PAID: 'text-green-700 bg-green-100',
    FAILED: 'text-red-700 bg-red-100',
    REFUNDED: 'text-blue-700 bg-blue-100',
};

const orderStatusColors: Record<OrderStatus, string> = {
    PENDING: 'text-yellow-700 bg-yellow-100',
    PROCESSING: 'text-blue-700 bg-blue-100',
    SHIPPED: 'text-indigo-700 bg-indigo-100',
    DELIVERED: 'text-green-700 bg-green-100',
    CANCELLED: 'text-red-700 bg-red-100',
};

const productStatusColors: Record<ProductStatus, string> = {
    FEATURED: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    INACTIVE: 'bg-gray-100 text-gray-500',
};

const tableColumns = {
    orders: ['Order Id', 'Customer', 'Items', 'Total', 'Payment Status', 'Order Status', 'Seller Note'],
    products: ['Product Id', 'Product', 'Label', 'Price', 'Unit', 'Stock', 'Status'],
    users: ['User Id', 'Username', 'Email', 'Phone number', 'Orders', 'Total Spent', 'Verified'],
};

function getProductStatus(product: AdminPanelProduct): ProductStatus {
    if (product.isFeatured) return 'FEATURED';
    if (product.isActive) return 'ACTIVE';
    return 'INACTIVE';
}

function ConfirmDeleteDialog({
    open,
    onOpenChange,
    count,
    entity,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    count: number;
    entity: string;
    onConfirm: () => void;
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {count} {entity}{count !== 1 ? 's' : ''}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is permanent and cannot be undone. The selected {entity.toLowerCase()}
                        {count !== 1 ? 's' : ''} will be removed from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={onConfirm}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function SellerNoteDialog({
    open,
    onOpenChange,
    initialNote,
    onSave,
}: {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    initialNote: string;
    onSave: (note: string) => void;
}) {
    const [note, setNote] = useState(initialNote);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-sm font-semibold">Seller Note</DialogTitle>
                </DialogHeader>
                <Textarea
                    className="min-h-30 resize-none text-sm"
                    placeholder="Add an internal note for this order..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <DialogFooter className="gap-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button size="sm" onClick={() => { onSave(note); onOpenChange(false); }}>Save Note</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InlineSelect<T extends string>({
    value,
    options,
    colorMap,
    onChange,
}: {
    value: T;
    options: Array<T>;
    colorMap: Record<T, string>;
    onChange: (value: T) => void;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className={cn(
                'text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer appearance-none',
                'focus:outline-none focus:ring-2 focus:ring-yellow-400',
                colorMap[value],
            )}
        >
            {options.map(option => (
                <option key={option} value={option} className="bg-white text-gray-900">
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                </option>
            ))}
        </select>
    );
}

function DataManagement({ products, orders, users }: {
    products: Array<AdminPanelProduct>;
    orders: Array<AdminPanelOrder>;
    users: Array<AdminPanelUser>;
}) {
    const [activeTab, setActiveTab] = useState<keyof typeof tableColumns>('orders');

    const [productsState, setProductsState] = useState<Array<AdminPanelProduct>>(products);
    const [optimisticProducts, addOptimisticProduct] = useOptimistic(
        productsState,
        (state, productEntity: AdminPanelProduct) => {
            const exists = state.some(product => product.productId === productEntity.productId);
            return exists
                ? state.map(product => product.productId === productEntity.productId ? productEntity : product)
                : [...state, productEntity];
        }
    );

    const [ordersState, setOrdersState] = useState<Array<AdminPanelOrder>>(orders);
    const [usersState, setUsersState] = useState<Array<AdminPanelUser>>(users);

    const [selectedItems, setSelectedItems] = useState({
        orders: new Set<string>(),
        products: new Set<string>(),
        users: new Set<string>(),
    });

    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
    const [currentProduct, setCurrentProduct] = useState<AdminPanelProduct | undefined>(undefined);

    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tab: keyof typeof tableColumns }>({
        open: false,
        tab: 'products',
    });

    const toggleSelect = (id: string, tab: keyof typeof tableColumns) => {
        setSelectedItems(prev => {
            const next = { ...prev, [tab]: new Set(prev[tab]) };
            next[tab].has(id) ? next[tab].delete(id) : next[tab].add(id);
            return next;
        });
    };

    const toggleSelectAll = (items: Array<string>, tab: keyof typeof tableColumns) => {
        setSelectedItems(prev => {
            const next = { ...prev, [tab]: new Set(prev[tab]) };
            next[tab].size === items.length ? next[tab].clear() : items.forEach(id => next[tab].add(id));
            return next;
        });
    };

    const handleSave = async (savedProduct: AdminPanelProduct) => {
        setSheetOpen(false);
        toast.success(`Product ${sheetMode === 'add' ? 'adding...' : 'updating...'}`);
        const temporaryId = `temporary-${crypto.randomUUID()}`;
        addOptimisticProduct({ ...savedProduct, productId: temporaryId });

        try {
            if (sheetMode === 'add') {
                const result = await createProduct({ data: savedProduct });
                if (result) setProductsState(prev => [...prev, result]);
            } else {
                const result = await updateProduct({ data: savedProduct });
                if (result) setProductsState(prev => prev.map(product => product.productId === result.productId ? result : product));
            }
            toast.success(`Product ${sheetMode === 'add' ? 'added' : 'updated'} successfully!`);
        } catch {
            toast.error(`Failed to ${sheetMode === 'add' ? 'add' : 'update'} product.`);
        }
    };

    const handleConfirmDelete = async () => {
        const { tab } = deleteDialog;
        try {
            if (tab === 'products') {
                const ids = Array.from(selectedItems.products);
                await deleteProducts({ data: ids });
                setProductsState(prev => prev.filter(product => !selectedItems.products.has(product.productId)));
                setSelectedItems(prev => ({ ...prev, products: new Set() }));
                toast.success('Products deleted.');
            } else if (tab === 'orders') {
                const ids = Array.from(selectedItems.orders);
                await deleteOrders({ data: ids });
                setOrdersState(prev => prev.filter(order => !selectedItems.orders.has(order.orderId)));
                setSelectedItems(prev => ({ ...prev, orders: new Set() }));
                toast.success('Orders deleted.');
            } else if (tab === 'users') {
                const ids = Array.from(selectedItems.users);
                await deleteUsers({ data: ids });
                setUsersState(prev => prev.filter(user => !selectedItems.users.has(user.id)));
                setSelectedItems(prev => ({ ...prev, users: new Set() }));
                toast.success('Users deleted.');
            }
        } catch {
            toast.error('Delete failed. Please try again.');
        }
        setDeleteDialog({ open: false, tab });
    };

    const handleOrderUpdate = async (
        orderId: string,
        patch: { paymentStatus?: PaymentStatus; status?: OrderStatus; sellerNotes?: string }
    ) => {
        setOrdersState(prev =>
            prev.map(order => order.orderId === orderId ? { ...order, ...patch } : order)
        );
        try {
            await updateOrderStatus({ data: { orderId, ...patch } });
            toast.success('Order updated.');
        } catch {
            toast.error('Failed to update order.');
            setOrdersState(orders);
        }
    };

    const handleProductStockUpdate = async (
        productId: string,
        patch: { inStock?: boolean; isFeatured?: boolean; isActive?: boolean; quantity?: number }
    ) => {
        setProductsState(prev =>
            prev.map(product => product.productId === productId ? { ...product, ...patch } : product)
        );
        try {
            await updateProductStock({ data: { productId, ...patch } });
            toast.success('Product updated.');
        } catch (error) {
            toast.error('Failed to update product.');
            setProductsState(products);
        }
    };

    const handleUserVerification = async (userId: string, emailVerified: boolean) => {
        setUsersState(prev =>
            prev.map(user => user.id === userId ? { ...user, emailVerified } : user)
        );
        try {
            await updateUserVerification({ data: { userId, emailVerified } });
            toast.success(`User ${emailVerified ? 'verified' : 'unverified'}.`);
        } catch {
            toast.error('Failed to update user.');
            setUsersState(users);
        }
    };

    const ActionButtons = ({ tab }: { tab: keyof typeof tableColumns }) => {
        const selectedCount = selectedItems[tab].size;
        const productId = Array.from(selectedItems.products)[0];
        const selectedProduct = productsState.find(product => product.productId === productId);

        return (
            <div className="flex gap-2">
                {selectedCount === 1 && (
                    <Link
                        to='/product/$productId'
                        params={{ productId: selectedProduct?.productId ?? '' }}
                        target='_blank'
                        className={cn(tabsListVariants(), 'px-2 text-sm text-black cursor-pointer')}
                    >
                        View
                    </Link>
                )}
                {selectedCount === 1 && tab === 'products' && (
                    <button
                        className={cn(tabsListVariants(), 'px-2 text-sm text-black cursor-pointer')}
                        onClick={() => {
                            if (selectedProduct) {
                                setCurrentProduct(selectedProduct);
                                setSheetMode('edit');
                                setSheetOpen(true);
                            }
                        }}
                    >
                        Edit
                    </button>
                )}
                {selectedCount >= 1 && (
                    <button
                        className={cn(tabsListVariants(), 'px-2 text-sm text-black hover:text-red-500 transition-all duration-150 cursor-pointer flex items-center gap-1')}
                        onClick={() => setDeleteDialog({ open: true, tab })}
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                )}
                {tab === 'products' && (
                    <button
                        className={cn(tabsListVariants(), 'px-2 text-sm text-black cursor-pointer')}
                        onClick={() => {
                            setSelectedItems(prev => ({ ...prev, products: new Set() }));
                            setSheetMode('add');
                            setCurrentProduct(undefined);
                            setSheetOpen(true);
                        }}
                    >
                        Add Products +
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            <Tabs id='Data Managing Dashboard' defaultValue={activeTab}>
                <div className="z-30 sticky top-16 bg-gray-50 p-2 flex flex-row items-center justify-between">
                    <div className="flex items-center justify-center gap-4">
                        <TabsList>
                            {(['orders', 'products', 'users'] as const).map(tab => (
                                <TabsTrigger key={tab} value={tab} onClick={() => setActiveTab(tab)}>
                                    {tab[0].toUpperCase() + tab.slice(1)}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="flex items-center justify-center text-sm text-gray-500">
                            {selectedItems[activeTab].size} selected
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <ActionButtons tab={activeTab} />
                    </div>
                </div>

                <TabsContent value='orders'>
                    <OrdersTable
                        orders={ordersState}
                        selectedItems={selectedItems.orders}
                        toggleSelect={(id) => toggleSelect(id, 'orders')}
                        toggleSelectAll={(ids) => toggleSelectAll(ids, 'orders')}
                        onOrderUpdate={handleOrderUpdate}
                    />
                </TabsContent>
                <TabsContent value='products'>
                    <ProductsTable
                        products={optimisticProducts}
                        selectedItems={selectedItems.products}
                        toggleSelect={(id) => toggleSelect(id, 'products')}
                        toggleSelectAll={(ids) => toggleSelectAll(ids, 'products')}
                        onProductStockUpdate={handleProductStockUpdate}
                    />
                </TabsContent>
                <TabsContent value='users'>
                    <UsersTable
                        users={usersState}
                        selectedItems={selectedItems.users}
                        toggleSelect={(id) => toggleSelect(id, 'users')}
                        toggleSelectAll={(ids) => toggleSelectAll(ids, 'users')}
                        onVerificationToggle={handleUserVerification}
                    />
                </TabsContent>
            </Tabs>

            <ProductSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mode={sheetMode}
                product={currentProduct}
                onSave={handleSave}
            />

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(value) => setDeleteDialog(dialog => ({ ...dialog, open: value }))}
                count={selectedItems[deleteDialog.tab].size}
                entity={deleteDialog.tab === 'orders' ? 'Order' : deleteDialog.tab === 'products' ? 'Product' : 'User'}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

function OrdersTable({
    orders,
    selectedItems,
    toggleSelect,
    toggleSelectAll,
    onOrderUpdate,
}: {
    orders: Array<AdminPanelOrder>;
    selectedItems: Set<string>;
    toggleSelect: (id: string) => void;
    toggleSelectAll: (ids: Array<string>) => void;
    onOrderUpdate: (orderId: string, patch: { paymentStatus?: PaymentStatus; status?: OrderStatus; sellerNotes?: string }) => void;
}) {
    const [expandedRows, setExpandedRows] = useState(new Set<string>());
    const [noteDialog, setNoteDialog] = useState<{ open: boolean; orderId: string; note: string }>({
        open: false, orderId: '', note: '',
    });

    const toggleRow = (id: string) =>
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const allIds = orders.map(order => order.orderId);

    return (
        <>
            <table className='w-full'>
                <thead className='z-25 sticky top-28 bg-gray-50'>
                    <tr>
                        <th className='w-10 px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>
                            <Checkbox className='cursor-pointer' checked={selectedItems.size === orders.length && orders.length > 0} onCheckedChange={() => toggleSelectAll(allIds)} />
                        </th>
                        {tableColumns.orders.map(column => (
                            <th key={column} className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {orders.map(order => {
                        const isExpanded = expandedRows.has(order.orderId);
                        const isSelected = selectedItems.has(order.orderId);

                        return (
                            <>
                                <tr key={order.orderId} className='hover:bg-yellow-50'>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                                        <Checkbox className='cursor-pointer' checked={isSelected} onCheckedChange={() => toggleSelect(order.orderId)} />
                                        <button
                                            type="button"
                                            onClick={() => toggleRow(order.orderId)}
                                            className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <ChevronDown
                                                size={14}
                                                style={{
                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono" title={order.orderId}>
                                        {order.orderId.slice(0, 8)}…
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format.currency(order.total)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                        {order.paymentMethod}
                                        <InlineSelect
                                            value={order.paymentStatus as PaymentStatus}
                                            options={PAYMENT_STATUSES}
                                            colorMap={paymentStatusColors}
                                            onChange={(value) => onOrderUpdate(order.orderId, { paymentStatus: value })}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <InlineSelect
                                            value={order.status as OrderStatus}
                                            options={ORDER_STATUSES}
                                            colorMap={orderStatusColors}
                                            onChange={(value) => onOrderUpdate(order.orderId, { status: value })}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => setNoteDialog({ open: true, orderId: order.orderId, note: order.sellerNotes ?? '' })}
                                            className={cn(
                                                'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer',
                                                order.sellerNotes
                                                    ? 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                                                    : 'border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300'
                                            )}
                                        >
                                            <Pencil size={11} />
                                            {order.sellerNotes ? 'Edit note' : 'Add note'}
                                        </button>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr key={`${order.orderId}-expanded`}>
                                        <td colSpan={8} className="px-6 py-5 bg-gray-50/60">
                                            <div className="grid grid-cols-1 gap-5">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider mb-2">Items</p>
                                                    <div className="space-y-2">
                                                        {order.items.map(item => {
                                                            const customizations = parseCustomizations(item.customizations);
                                                            return (
                                                                <div key={item.productId} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-medium">{item.productName}</span>
                                                                            <span className="text-zinc-700 text-xs">x{item.quantity}</span>
                                                                            <span className="text-xs ml-auto">{format.currency(item.productPrice * item.quantity)}</span>
                                                                        </div>
                                                                        {customizations.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                                                {customizations.map(group => (
                                                                                    <span key={group.title} className="text-xs bg-yellow-500/60 px-2 py-0.5 rounded-full">
                                                                                        {group.title}: {group.options.map(option => option.label).join(', ')}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wider mb-2">Shipping Address</p>
                                                        <p className="text-gray-700 text-sm">
                                                            {order.shippingAddress1}, {order.shippingAddress2 && `${order.shippingAddress2}, `}
                                                            {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wider mb-2">Metadata</p>
                                                        <div className="space-y-1 text-xs text-gray-700">
                                                            <div className="flex gap-2"><span>Placed</span><span>{format.dateD(order.createdAt)} at {format.timeD(order.createdAt)}</span></div>
                                                            <div className="flex gap-2"><span>Method</span><span>{order.paymentMethod}</span></div>
                                                            {order.orderNotes && (
                                                                <div className="flex gap-2 mt-1">
                                                                    <span>Note</span>
                                                                    <span className="text-yellow-800">'{order.orderNotes}'</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>

            <SellerNoteDialog
                open={noteDialog.open}
                onOpenChange={(value) => setNoteDialog(dialog => ({ ...dialog, open: value }))}
                initialNote={noteDialog.note}
                onSave={(note) => onOrderUpdate(noteDialog.orderId, { sellerNotes: note })}
            />
        </>
    );
}

function ProductsTable({
    products,
    selectedItems,
    toggleSelect,
    toggleSelectAll,
    onProductStockUpdate,
}: {
    products: Array<AdminPanelProduct>;
    selectedItems: Set<string>;
    toggleSelect: (id: string) => void;
    toggleSelectAll: (ids: Array<string>) => void;
    onProductStockUpdate: (productId: string, patch: { inStock?: boolean; isFeatured?: boolean; isActive?: boolean; quantity?: number }) => void;
}) {
    const [expandedRows, setExpandedRows] = useState(new Set<string>());
    const [editingStock, setEditingStock] = useState<{ productId: string; quantity: string } | null>(null);

    const toggleRow = (id: string) =>
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const commitStockEdit = (product: AdminPanelProduct) => {
        if (!editingStock || editingStock.productId !== product.productId) return;
        const parsed = parseInt(editingStock.quantity, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed !== product.quantity) {
            onProductStockUpdate(product.productId, {
                quantity: parsed,
                inStock: parsed > 0,
            });
        }
        setEditingStock(null);
    };

    const handleStatusChange = (product: AdminPanelProduct, newStatus: ProductStatus) => {
        onProductStockUpdate(product.productId, {
            isFeatured: newStatus === 'FEATURED',
            isActive: newStatus === 'FEATURED' || newStatus === 'ACTIVE',
        });
    };

    const allIds = products.map(product => product.productId);

    return (
        <table className='w-full'>
            <thead className='z-25 sticky top-28 bg-gray-50'>
                <tr>
                    <th className='w-10 px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>
                        <Checkbox className='cursor-pointer' checked={selectedItems.size === products.length && products.length > 0} onCheckedChange={() => toggleSelectAll(allIds)} />
                    </th>
                    {tableColumns.products.map(column => (
                        <th key={column} className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
                {products.map(product => {
                    const isExpanded = expandedRows.has(product.productId);
                    const isSelected = selectedItems.has(product.productId);
                    const isEditingThisStock = editingStock?.productId === product.productId;
                    const currentStatus = getProductStatus(product);

                    return (
                        <>
                            <tr key={product.productId} className='hover:bg-yellow-50'>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                                    <Checkbox className='cursor-pointer' checked={isSelected} onCheckedChange={() => toggleSelect(product.productId)} />
                                    <button
                                        type="button"
                                        onClick={() => toggleRow(product.productId)}
                                        className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <ChevronDown
                                            size={14}
                                            style={{
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono" title={product.productId}>{product.productId.slice(0, 5)}…</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.productName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.label ?? '—'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {format.currency(product.productPrice ?? 0)}{' '}
                                    {product.originalPrice && <span className='line-through text-gray-400 text-sm'>{product.originalPrice}</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">per {product.unit ?? 'unit'}</td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isEditingThisStock ? (
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="number"
                                                min={0}
                                                autoFocus
                                                value={editingStock.quantity}
                                                onChange={(e) => setEditingStock({ productId: product.productId, quantity: e.target.value })}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') commitStockEdit(product);
                                                    if (e.key === 'Escape') setEditingStock(null);
                                                }}
                                                className="w-16 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                            <button
                                                onClick={() => commitStockEdit(product)}
                                                className="flex items-center justify-center w-5 h-5 rounded text-green-600 hover:bg-green-50 cursor-pointer"
                                            >
                                                <Check size={12} />
                                            </button>
                                            <button
                                                onClick={() => setEditingStock(null)}
                                                className="flex items-center justify-center w-5 h-5 rounded text-gray-400 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setEditingStock({ productId: product.productId, quantity: String(product.quantity ?? 0) })}
                                            className={cn(
                                                'group flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer',
                                                product.lowStockThreshold && product.quantity != null && product.quantity <= product.lowStockThreshold
                                                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                    : product.inStock
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            )}
                                        >
                                            {product.lowStockThreshold && product.quantity != null && product.quantity <= product.lowStockThreshold
                                                ? 'Low Stock'
                                                : product.inStock ? 'In Stock' : 'Out of Stock'}
                                            {product.quantity != null && (
                                                <span className="opacity-60">({product.quantity})</span>
                                            )}
                                            <Pencil size={10} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                                        </button>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <InlineSelect
                                        value={currentStatus}
                                        options={PRODUCT_STATUSES}
                                        colorMap={productStatusColors}
                                        onChange={(value) => handleStatusChange(product, value)}
                                    />
                                </td>
                            </tr>

                            {isExpanded && (
                                <tr key={`${product.productId}-expanded`}>
                                    <td colSpan={8} className="px-6 py-5 bg-gray-50/60">
                                        <div className="grid grid-cols-1 gap-5">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider mb-2">Customizations</p>
                                                {product.customizations && product.customizations.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {product.customizations.map(group => (
                                                            <span key={group.title} className="text-xs bg-yellow-500/60 px-2 py-0.5 rounded-full">
                                                                {group.title}:{' '}
                                                                {group.options.map(option =>
                                                                    option.additionalPrice > 0
                                                                        ? `${option.label} (+${format.currency(option.additionalPrice)})`
                                                                        : option.label
                                                                ).join(', ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400">No customizations</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
                                                    <p className="text-gray-700 text-sm">{product.description}</p>
                                                    <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-bold h-7">
                                                        <Star className="h-3 w-3 mr-1 fill-yellow-700" />
                                                        {product.rating?.toFixed(1) ?? 'N/A'}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider mb-2">Metadata</p>
                                                    <div className="space-y-1 text-xs text-gray-700">
                                                        <div className="flex gap-2"><span>Updated:</span><span>{format.dateD(product.updatedAt)} at {format.timeD(product.updatedAt)}</span></div>
                                                        <div className="flex gap-2"><span>Label:</span><span>{product.label}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    );
                })}
            </tbody>
        </table>
    );
}

function UsersTable({
    users,
    selectedItems,
    toggleSelect,
    toggleSelectAll,
    onVerificationToggle,
}: {
    users: Array<AdminPanelUser>;
    selectedItems: Set<string>;
    toggleSelect: (id: string) => void;
    toggleSelectAll: (ids: Array<string>) => void;
    onVerificationToggle: (userId: string, verified: boolean) => void;
}) {
    const [expandedRows, setExpandedRows] = useState(new Set<string>());

    const toggleRow = (id: string) =>
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const allIds = users.map(user => user.id);

    return (
        <table className='w-full'>
            <thead className='z-25 sticky top-28 bg-gray-50'>
                <tr>
                    <th className='w-10 px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>
                        <Checkbox checked={selectedItems.size === allIds.length && allIds.length > 0} onCheckedChange={() => toggleSelectAll(allIds)} />
                    </th>
                    {tableColumns.users.map(column => (
                        <th key={column} className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
                {users.map(user => {
                    const isExpanded = expandedRows.has(user.id);
                    const isSelected = selectedItems.has(user.id);

                    return (
                        <>
                            <tr key={user.id} className='hover:bg-yellow-50'>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2'>
                                    <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(user.id)} />
                                    <button
                                        type="button"
                                        onClick={() => toggleRow(user.id)}
                                        className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        aria-label="Expand orders"
                                    >
                                        <ChevronDown
                                            size={14}
                                            style={{
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        />
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono' title={user.id}>{user.id.slice(0, 5)}…</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{user.name}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{user.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{user.phoneNumber ?? '—'}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{user.orders.length}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{format.currency(user.orders.reduce((sum, order) => sum + order.total, 0))}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => onVerificationToggle(user.id, !user.emailVerified)}
                                        className={cn(
                                            'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors cursor-pointer',
                                            user.emailVerified
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        )}
                                    >
                                        {user.emailVerified
                                            ? <><CheckCircle2 size={12} /> Verified</>
                                            : <><XCircle size={12} /> Unverified</>
                                        }
                                    </button>
                                </td>
                            </tr>
                            {isExpanded && (
                                <tr key={`${user.id}-expanded`}>
                                    <td colSpan={8} className="px-6 py-4 bg-gray-50/60">
                                        <p className="text-xs font-semibold uppercase tracking-wider mb-2">Order IDs</p>
                                        {user.orders.length === 0 ? (
                                            <p className="text-xs text-gray-400">No orders yet.</p>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {user.orders.map((order) => (
                                                    <div key={`${user.id}-${order.orderId}`} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium">{order.orderId}</span>
                                                                <span className="text-zinc-700 text-xs">(x{order._count.items} items)</span>
                                                                <span className="text-xs ml-auto">{format.currency(order.total)}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </>
                    );
                })}
            </tbody>
        </table>
    );
}

export default DataManagement;