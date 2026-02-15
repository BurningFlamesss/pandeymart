import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import type { CustomizationGroup, Product } from '@/types/Product';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ProductSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'add' | 'edit';
    product?: Product;
    onSave: (updatedProduct: Product) => void;
}

const CATEGORIES = ['Apparel', 'Accessories', 'Home', 'Beauty', 'Electronics'];
const UNITS = ['kg', 'g', 'ltr', 'pcs', 'unit'];
const LABELS = ['Best Seller', 'Super Saver', 'New Arrival', 'Limited', 'Hot Deal'];

function simpleSlugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

function generateId(): string {
    return `P${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

const EMPTY_PRODUCT: Partial<Product> = {
    productImages: [],
    customizations: [],
    tags: [],
    inStock: true,
    isActive: true,
    isFeatured: false,
};

export function ProductSheet({ open, onOpenChange, mode, product, onSave }: ProductSheetProps) {
    const [data, setData] = useState<Partial<Product>>(product ? { ...product } : { ...EMPTY_PRODUCT, productId: generateId(), createdAt: new Date().toISOString() });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (mode === "edit" && product) {
            setData({ ...product });
        }

        if (mode === "add") {
            setData({
                ...EMPTY_PRODUCT,
                productId: generateId(),
                createdAt: new Date().toISOString(),
            });
        }

        setErrors({});
    }, [product, mode, open]);


    const patch = (updates: Partial<Product>) => setData((prev) => ({ ...prev, ...updates }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!data.productName?.trim()) e.productName = 'Required';
        if (data.productPrice == null) e.productPrice = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const now = new Date().toISOString();
        onSave({
            ...data,
            productId: data.productId!,
            productName: data.productName!,
            productImages: data.productImages ?? [],
            slug: data.slug || simpleSlugify(data.productName!),
            updatedAt: now,
            createdAt: data.createdAt ?? now,
            customizations: data.customizations ?? [],
            tags: data.tags ?? [],
        } as Product);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        {mode === "add"
                            ? "Create New Product"
                            : `Editing: ${product?.productName}`}
                    </SheetTitle>
                    <SheetDescription>Manage product details.</SheetDescription>
                </SheetHeader>
                <div data-lenis-prevent className="no-scrollbar overflow-y-auto px-4 py-2">
                    <Tabs defaultValue="basics">
                        <TabsList className="grid w-full grid-cols-5 mb-4">
                            <TabsTrigger value="basics">Basics</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                            <TabsTrigger value="pricing">Pricing</TabsTrigger>
                            <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            <TabsTrigger value="customize">Customize</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basics" className="space-y-4">
                            <div className='space-y-2'>
                                <Label htmlFor="productName">Name *</Label>
                                <Input id="productName" value={data.productName ?? ''} onChange={(e) => patch({ productName: e.target.value })} />
                                {errors.productName && <p className="text-sm text-red-600">{errors.productName}</p>}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={data.slug ?? ''} onChange={(e) => patch({ slug: e.target.value })} />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="category">Category</Label>
                                <Select value={data.category ?? ''} onValueChange={(v) => patch({ category: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
                            </div>
                            <div className='space-y-2'>
                                <Label>Tags</Label>
                                <TagInput tags={data.tags ?? []} onChange={(v) => patch({ tags: v })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <Label htmlFor="label">Label</Label>
                                    <Select value={data.label ?? ''} onValueChange={(v) => patch({ label: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="None" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LABELS.map((lbl) => (
                                                <SelectItem key={lbl} value={lbl}>
                                                    {lbl}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="labelColor">Label Color</Label>
                                    <Input id="labelColor" type="color" value={data.labelColor ?? '#f59e0b'} onChange={(e) => patch({ labelColor: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="isActive" checked={!!data.isActive} onCheckedChange={(checked) => patch({ isActive: !!checked })} />
                                    <Label htmlFor="isActive">Active</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="isFeatured" checked={!!data.isFeatured} onCheckedChange={(checked) => patch({ isFeatured: !!checked })} />
                                    <Label htmlFor="isFeatured">Featured</Label>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="media" className="space-y-4">
                            <ImageUploader images={data.productImages ?? []} onChange={(v) => patch({ productImages: v })} />
                        </TabsContent>
                        <TabsContent value="pricing" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <Label htmlFor="productPrice">
                                        Price *
                                        <span className="ml-1 text-xs text-muted-foreground">(Selling price)</span>
                                    </Label>
                                    <Input
                                        id="productPrice"
                                        type="number"
                                        value={data.productPrice ?? ''}
                                        onChange={(e) => {
                                            const price = parseFloat(e.target.value) || undefined;
                                            const orig = data.originalPrice;
                                            const discount = price && orig && orig > price ? Math.round((1 - price / orig) * 100) : undefined;
                                            patch({ productPrice: price, discountPercentage: discount });
                                        }}
                                    />
                                    {data.discountPercentage && (
                                        <p className="text-xs text-green-600 font-medium">
                                            {data.discountPercentage}% discount applied
                                        </p>
                                    )}

                                    {errors.productPrice && <p className="text-sm text-red-600">{errors.productPrice}</p>}
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="originalPrice">
                                        Original Price
                                        <span className="ml-1 text-xs text-muted-foreground">(Before discount)</span>
                                    </Label>

                                    <Input
                                        id="originalPrice"
                                        type="number"
                                        value={data.originalPrice ?? ''}
                                        onChange={(e) => {
                                            const orig = parseFloat(e.target.value) || undefined;
                                            const price = data.productPrice;
                                            const discount = price && orig && orig > price ? Math.round((1 - price / orig) * 100) : undefined;
                                            patch({ originalPrice: orig, discountPercentage: discount });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select value={data.unit ?? ''} onValueChange={(v) => patch({ unit: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UNITS.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" type="number" value={data.quantity ?? ''} onChange={(e) => patch({ quantity: parseInt(e.target.value) || undefined })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <Label htmlFor="minOrderQuantity">Min Order</Label>
                                    <Input id="minOrderQuantity" type="number" value={data.minOrderQuantity ?? ''} onChange={(e) => patch({ minOrderQuantity: parseInt(e.target.value) || undefined })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="maxOrderQuantity">Max Order</Label>
                                    <Input id="maxOrderQuantity" type="number" value={data.maxOrderQuantity ?? ''} onChange={(e) => patch({ maxOrderQuantity: parseInt(e.target.value) || undefined })} />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="inventory" className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="inStock" checked={!!data.inStock} onCheckedChange={(checked) => patch({ inStock: !!checked })} />
                                <Label htmlFor="inStock">In Stock</Label>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                                <Input id="lowStockThreshold" type="number" value={data.lowStockThreshold ?? ''} onChange={(e) => patch({ lowStockThreshold: parseInt(e.target.value) || undefined })} />
                            </div>
                        </TabsContent>
                        <TabsContent value="customize" className="space-y-4">
                            <CustomizationsEditor groups={data.customizations ?? []} onChange={(value) => patch({ customizations: value })} />
                        </TabsContent>
                    </Tabs>
                </div>
                <SheetFooter>
                    <Button className='cursor-pointer' onClick={handleSave}>{mode === 'add' ? 'Create' : 'Save'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

interface ImageUploaderProps {
    images: Array<string>;
    onChange: (images: Array<string>) => void;
}

function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [urlInput, setUrlInput] = useState("");

    const addUrl = () => {
        const trimmed = urlInput.trim();
        if (trimmed && !images.includes(trimmed)) {
            onChange([...images, trimmed]);
        }
        setUrlInput("");
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                    <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                    <Button onClick={addUrl}>Add</Button>
                </div>
            </div>

            {images.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">
                        Uploaded Images
                    </Label>

                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 border rounded-lg p-3 bg-background hover:bg-muted/40 transition"
                        >
                            <div className="w-14 h-14 rounded-md overflow-hidden border bg-muted">
                                <img
                                    src={img}
                                    alt={`product-${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 text-xs text-muted-foreground truncate">
                                {img}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-600"
                                onClick={() =>
                                    onChange(images.filter((_, idx) => idx !== i))
                                }
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


interface CustomizationsEditorProps {
    groups: Array<CustomizationGroup>;
    onChange: (groups: Array<CustomizationGroup>) => void;
}

function CustomizationsEditor({ groups, onChange }: CustomizationsEditorProps) {
    const addGroup = () =>
        onChange([
            ...groups,
            { title: "", options: [{ label: "", additionalPrice: 0 }] },
        ]);

    const updateGroup = (groupIndex: number, patch: Partial<CustomizationGroup>) => {
        onChange(groups.map((group, i) => (i === groupIndex ? { ...group, ...patch } : group)));
    };

    const removeGroup = (groupIndex: number) =>
        onChange(groups.filter((_, i) => i !== groupIndex));

    const addOption = (groupIndex: number) => {
        updateGroup(groupIndex, {
            options: [...groups[groupIndex].options, { label: "", additionalPrice: 0 }],
        });
    };

    const updateOption = (
        groupIndex: number,
        optionIndex: number,
        patch: Partial<CustomizationGroup["options"][number]>
    ) => {
        const options = groups[groupIndex].options.map((option, i) =>
            i === optionIndex ? { ...option, ...patch } : option
        );
        updateGroup(groupIndex, { options });
    };

    const removeOption = (groupIndex: number, optionIndex: number) => {
        const options = groups[groupIndex].options.filter((_, i) => i !== optionIndex);
        updateGroup(groupIndex, { options });
    };

    return (
        <div className="space-y-8">
            {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4 border rounded-lg p-5 bg-muted/30">

                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <Input
                                value={group.title}
                                onChange={(e) =>
                                    updateGroup(groupIndex, { title: e.target.value })
                                }
                                placeholder="e.g. Size, Color"
                            />

                                <p className="text-xs text-muted-foreground">
                                    Customers will choose one option from {group.title ? group.title : "..."}.
                                </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-red-600"
                            onClick={() => removeGroup(groupIndex)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="relative ml-6 border-l pl-6 space-y-4">

                        {group.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="space-y-2">

                                <div className="flex items-center gap-3">
                                    <Input
                                        value={option.label}
                                        onChange={(e) =>
                                            updateOption(groupIndex, optionIndex, { label: e.target.value })
                                        }
                                        placeholder="Option label"
                                    />

                                    <div className="relative w-1/2">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            + Rs.
                                        </span>
                                        <Input
                                            type="number"
                                            className="pl-10"
                                            value={option.additionalPrice ?? ""}
                                            onChange={(e) =>
                                                updateOption(groupIndex, optionIndex, {
                                                    additionalPrice:
                                                        parseFloat(e.target.value) || 0,
                                                })
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:text-red-600"
                                        onClick={() => removeOption(groupIndex, optionIndex)}
                                        disabled={group.options.length === 1}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="link"
                            className="p-0 text-sm"
                            onClick={() => addOption(groupIndex)}
                        >
                            + Add option
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                variant="outline"
                className="w-full"
                onClick={addGroup}
            >
                Add Customization Group
            </Button>
        </div>
    );
}


interface TagInputProps {
    tags: Array<string>;
    onChange: (tags: Array<string>) => void;
}

function TagInput({ tags, onChange }: TagInputProps) {
    const [input, setInput] = useState('');

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim() && !tags.includes(input.trim())) {
            onChange([...tags, input.trim()]);
            setInput('');
        }
    };

    return (
        <div className="space-y-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={addTag} placeholder="Add tag" />
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center space-x-1">
                        {tag}
                        <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))}>
                            <Trash className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}