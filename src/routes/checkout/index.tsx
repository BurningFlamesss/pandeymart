import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/middleware/auth'
import { useCart } from "@/hooks/use-cart";
import { getProducts } from "@/server/functions/getProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageSlider from "@/components/shared/ImageSlider";

export const Route = createFileRoute('/checkout/')({
  async beforeLoad() {
    await requireAuth()
  },
  component: RouteComponent,
})

interface Customization {
  label: string;
  additionalPrice: number;
}

interface CustomizationGroup {
  title: string;
  options: Array<Customization>;
}

interface Product {
  productId: string;
  productName: string;
  productImages: Array<string>;
  productPrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  unit?: string;
  quantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  inStock?: boolean;
  lowStockThreshold?: number;
  category?: string;
  customizations?: Array<CustomizationGroup>;
}

interface CartItem {
  cartItemId: string;
  productId: string;
  basePrice: number;
  quantity: number;
  customizations?: Array<CustomizationGroup>;
}

interface ValidationResult {
  cartItemId: string;
  productId: string;
  productName: string;
  issues: Array<string>;
  correctedPrice?: number;
  correctedQuantity?: number;
  isAvailable: boolean;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: Array<{ groupTitle: string; options: Array<string> }>;
}

interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<OrderItem>;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: "Online" | "Cash on Delivery";
  paymentStatus: "Pending" | "Paid";
  orderStatus: "Pending";
  shippingAddress: string;
  createdAt: string;
  notes?: string;
}

interface OrderMutationPayload {
  order: Order;
  addressToSave: SavedAddress | null;
}

interface SavedAddress {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
}

const SAVED_ADDRESSES_KEY = "checkout_saved_addresses";

function getSavedAddresses(): Array<SavedAddress> {
  try {
    const raw = localStorage.getItem(SAVED_ADDRESSES_KEY);
    return raw ? (JSON.parse(raw) as Array<SavedAddress>) : [];
  } catch {
    return [];
  }
}

function persistSavedAddresses(addresses: Array<SavedAddress>): void {
  localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses));
}

function addSavedAddress(incoming: SavedAddress): Array<SavedAddress> {
  const current = getSavedAddresses();
  const isDuplicate = current.some(
    (saved) =>
      saved.addressLine1 === incoming.addressLine1 &&
      saved.city === incoming.city &&
      saved.postalCode === incoming.postalCode
  );
  if (isDuplicate) return current;
  const updated = [...current, incoming];
  persistSavedAddresses(updated);
  return updated;
}

function removeSavedAddress(addressId: string): Array<SavedAddress> {
  const updated = getSavedAddresses().filter((a) => a.id !== addressId);
  persistSavedAddresses(updated);
  return updated;
}

function calculateItemUnitPrice(
  basePrice: number,
  customizations: Array<CustomizationGroup>
): number {
  const additionalTotal = customizations
    .flatMap((group) => group.options)
    .reduce((sum, option) => sum + option.additionalPrice, 0);
  return basePrice + additionalTotal;
}

async function submitOrder({ order }: OrderMutationPayload): Promise<{ orderId: string }> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error("Order failed");
  return response.json();
}

function validateCartAgainstProducts(
  cart: Array<CartItem>,
  products: Array<Product>
): { validations: Array<ValidationResult>; hasIssues: boolean } {
  const productMap = new Map(products.map((p) => [p.productId, p]));

  const validations: Array<ValidationResult> = cart.map((cartItem) => {
    const product = productMap.get(cartItem.productId);
    const issues: Array<string> = [];
    let correctedPrice: number | undefined;
    let correctedQuantity: number | undefined;
    let isAvailable = true;

    if (!product) {
      return {
        cartItemId: cartItem.cartItemId,
        productId: cartItem.productId,
        productName: "Unknown Product",
        issues: ["Product no longer exists"],
        isAvailable: false,
      };
    }

    if (product.inStock === false) {
      issues.push("Out of stock");
      isAvailable = false;
    }

    const currentBasePrice = product.productPrice ?? cartItem.basePrice;
    if (currentBasePrice !== cartItem.basePrice) {
      correctedPrice = currentBasePrice;
      issues.push(`Price updated from Rs. ${cartItem.basePrice} to Rs. ${currentBasePrice}`);
    }

    if (cartItem.customizations?.length) {
      let customizationPriceChanged = false;
      cartItem.customizations.forEach((cartGroup) => {
        const productGroup = product.customizations?.find((pg) => pg.title === cartGroup.title);
        if (productGroup) {
          cartGroup.options.forEach((cartOption) => {
            const productOption = productGroup.options.find((po) => po.label === cartOption.label);
            if (productOption && productOption.additionalPrice !== cartOption.additionalPrice) {
              customizationPriceChanged = true;
            }
          });
        }
      });
      if (customizationPriceChanged) {
        issues.push("Customization prices have been updated");
        correctedPrice = correctedPrice ?? currentBasePrice;
      }
    }

    const minQuantity = product.minOrderQuantity ?? 1;
    const maxQuantity = product.maxOrderQuantity ?? Infinity;
    const availableQuantity = product.quantity ?? Infinity;

    if (cartItem.quantity < minQuantity) {
      correctedQuantity = minQuantity;
      issues.push(`Minimum order quantity is ${minQuantity}`);
    }
    if (cartItem.quantity > maxQuantity) {
      correctedQuantity = Math.min(maxQuantity, cartItem.quantity);
      issues.push(`Maximum order quantity is ${maxQuantity}`);
    }
    if (cartItem.quantity > availableQuantity) {
      correctedQuantity = Math.min(availableQuantity, cartItem.quantity, maxQuantity);
      issues.push(`Only ${availableQuantity} units available`);
      if (availableQuantity === 0) isAvailable = false;
    }

    return {
      cartItemId: cartItem.cartItemId,
      productId: cartItem.productId,
      productName: product.productName,
      issues,
      correctedPrice,
      correctedQuantity,
      isAvailable,
    };
  });

  return {
    validations,
    hasIssues: validations.some((v) => v.issues.length > 0 || !v.isAvailable),
  };
}

function ValidationBanner({ validations }: { validations: Array<ValidationResult> }) {
  const itemsWithIssues = validations.filter((v) => v.issues.length > 0);
  if (itemsWithIssues.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">Cart Updated</p>
      <ul className="space-y-1">
        {itemsWithIssues.map((validation) =>
          validation.issues.map((issue, issueIndex) => (
            <li key={`${validation.cartItemId}-${issueIndex}`} className="text-sm text-amber-800">
              <span className="font-medium">{validation.productName}:</span> {issue}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function OrderSummaryItem({
  cartItem,
  product,
  validation,
}: {
  cartItem: CartItem;
  product: Product;
  validation?: ValidationResult;
}) {
  const effectivePrice = validation?.correctedPrice ?? cartItem.basePrice;
  const effectiveQuantity = validation?.correctedQuantity ?? cartItem.quantity;
  const unitPrice = calculateItemUnitPrice(effectivePrice, cartItem.customizations ?? []);
  const lineTotal = unitPrice * effectiveQuantity;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-stone-100 last:border-0">
      <Link
        to="/product/$productId"
        params={{ productId: product.productId }}
        className="shrink-0 flex flex-col items-center justify-center max-w-24 relative"
      >
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100">
          <ImageSlider images={product.productImages} />
        </div>
        {cartItem.customizations?.length ? (
          <div className="absolute top-1 mx-auto mt-1 flex flex-wrap gap-1 text-[10px] flex-row items-center justify-center">
            {cartItem.customizations.map((group) =>
              group.options.map((option) => (
                <span
                  key={`${group.title}-${option.label}`}
                  className="px-2 py-0.5 bg-black/50 rounded text-white"
                >
                  {option.label}
                </span>
              ))
            )}
          </div>
        ) : null}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-800 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
          {effectiveQuantity}
        </span>
      </Link>

      <div className="flex h-24 flex-col">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">{product.productName}</p>
          {cartItem.customizations?.map((group) => (
            <p key={group.title} className="text-xs text-stone-400 mt-0.5">
              {group.title}: {group.options.map((option) => option.label).join(", ")}
            </p>
          ))}
          {validation && !validation.isAvailable && (
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-stone-800 tabular-nums">Rs. {lineTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-stone-700 mb-5">
      {children}
    </h2>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  span = "full",
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  span?: "half" | "full";
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={span === "half" ? "col-span-1" : "col-span-2"}>
      <Label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
        {label}
      </Label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-300 focus-visible:ring-red-100" : ""}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function RouteComponent() {
  const { cart, clearCart } = useCart();

  const [step, setStep] = useState<"details" | "payment" | "confirmed">("details");
  const [isValidating, setIsValidating] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<Array<SavedAddress>>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
  const [saveForLater, setSaveForLater] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    notes: "",
    paymentMethod: "Online" as "Online" | "Cash on Delivery",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setSavedAddresses(getSavedAddresses());
  }, []);

  const { data: realProducts = [], isPending, isError } = useQuery({
    queryKey: ["checkout-products", cart.map((c) => c.productId).sort().join(",")],
    queryFn: () => {
      if (cart.length === 0) return [];
      const uniqueProductIds = [...new Set(cart.map((c) => c.productId))];
      return getProducts({ data: uniqueProductIds });
    },
    enabled: cart.length > 0,
  });

  const productMap = useMemo(
    () => new Map(realProducts.map((p) => [p.productId, p])),
    [realProducts]
  );

  const mergedItems = useMemo(
    () => cart.map((cartItem) => ({ ...cartItem, product: productMap.get(cartItem.productId) })),
    [cart, productMap]
  );

  const { validations } = useMemo(() => {
    if (isPending || realProducts.length === 0) return { validations: [], hasIssues: false };
    return validateCartAgainstProducts(cart, realProducts);
  }, [cart, realProducts, isPending]);

  useEffect(() => {
    if (!isPending) setIsValidating(false);
  }, [isPending]);

  const { subtotal, shippingCost, grandTotal } = useMemo(() => {
    const subtotalAmount = cart.reduce((sum, cartItem) => {
      const validation = validations.find((v) => v.cartItemId === cartItem.cartItemId);
      const price = validation?.correctedPrice ?? cartItem.basePrice;
      const quantity = validation?.correctedQuantity ?? cartItem.quantity;
      const unitPrice = calculateItemUnitPrice(price, cartItem.customizations ?? []);
      return sum + unitPrice * quantity;
    }, 0);
    const shipping = subtotalAmount >= 2000 ? 0 : 100;
    return { subtotal: subtotalAmount, shippingCost: shipping, grandTotal: subtotalAmount + shipping };
  }, [cart, validations]);

  const unavailableItems = validations.filter((v) => !v.isAvailable);
  const canProceed = unavailableItems.length === 0 && cart.length > 0;

  const { mutate: placeOrder, isPending: isPlacing } = useMutation({
    mutationFn: submitOrder,
    onSuccess: ({ orderId }, { addressToSave }) => {
      if (addressToSave) {
        const updated = addSavedAddress(addressToSave);
        setSavedAddresses(updated);
      }
      setConfirmedOrderId(orderId);
      setStep("confirmed");
      clearCart();
    },
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function applySavedAddress(address: SavedAddress) {
    setSelectedSavedAddressId(address.id);
    setForm((prev) => ({
      ...prev,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      stateProvince: address.stateProvince,
      postalCode: address.postalCode,
    }));
    setErrors((prev) => ({
      ...prev,
      addressLine1: undefined,
      city: undefined,
      stateProvince: undefined,
      postalCode: undefined,
    }));
  }

  function handleDeleteSavedAddress(addressId: string) {
    const updated = removeSavedAddress(addressId);
    setSavedAddresses(updated);
    if (selectedSavedAddressId === addressId) {
      setSelectedSavedAddressId(null);
    }
  }

  function validate() {
    const fieldErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.firstName.trim()) fieldErrors.firstName = "Required";
    if (!form.lastName.trim()) fieldErrors.lastName = "Required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) fieldErrors.email = "Valid email required";
    if (!form.phone.match(/^\+?[\d\s-]{7,15}$/)) fieldErrors.phone = "Valid phone required";
    if (!form.addressLine1.trim()) fieldErrors.addressLine1 = "Required";
    if (!form.city.trim()) fieldErrors.city = "Required";
    if (!form.stateProvince.trim()) fieldErrors.stateProvince = "Required";
    if (!form.postalCode.trim()) fieldErrors.postalCode = "Required";
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const shippingAddress = [
      form.addressLine1,
      form.addressLine2,
      form.city,
      form.stateProvince,
      form.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const addressToSave: SavedAddress | null = saveForLater
      ? {
        id: `addr_${Date.now()}`,
        label: `${form.addressLine1}, ${form.city}`,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        stateProvince: form.stateProvince,
        postalCode: form.postalCode,
      }
      : null;

    if (addressToSave) {
      const updated = addSavedAddress(addressToSave);
      setSavedAddresses(updated);
    }

    const orderItems: Array<OrderItem> = cart
      .filter((cartItem) => {
        const validation = validations.find((v) => v.cartItemId === cartItem.cartItemId);
        return !validation || validation.isAvailable;
      })
      .map((cartItem) => {
        const validation = validations.find((v) => v.cartItemId === cartItem.cartItemId);
        const product = productMap.get(cartItem.productId);
        const price = validation?.correctedPrice ?? cartItem.basePrice;
        const quantity = validation?.correctedQuantity ?? cartItem.quantity;
        const unitPrice = calculateItemUnitPrice(price, cartItem.customizations ?? []);
        return {
          productId: cartItem.productId,
          productName: product?.productName ?? cartItem.productId,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          customizations: (cartItem.customizations ?? []).map((group) => ({
            groupTitle: group.title,
            options: group.options.map((option) => option.label),
          })),
        };
      });

    const order: Order = {
      orderId: `ORD-${Date.now()}`,
      customerName: `${form.firstName} ${form.lastName}`,
      customerEmail: form.email,
      customerPhone: form.phone,
      items: orderItems,
      subtotal,
      shippingCost,
      totalAmount: grandTotal,
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      orderStatus: "Pending",
      shippingAddress,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    placeOrder({ order, addressToSave: null });
  }

  if (cart.length === 0) {
    return (
      <div className='h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center'>
        No Items in the Cart
      </div>
    );
  }


  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl text-stone-800 mb-2">Order Placed</h1>
          <p className="text-stone-400 text-sm mb-1">
            Thank you, {form.firstName}! You'll receive a confirmation shortly.
          </p>
          {confirmedOrderId && (
            <p className="text-xs text-stone-400 mt-4 font-mono tracking-wider">{confirmedOrderId}</p>
          )}
          <Button
            onClick={() => (window.location.href = "/")}
            className="mt-8"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          <div>
            <h1 className="text-3xl text-stone-800 mb-1">Checkout</h1>
            <p className="text-stone-400 text-sm mb-8">
              {cart.length} {cart.length === 1 ? "item" : "items"} · Rs. {grandTotal.toFixed(2)} total
            </p>

            {isValidating ? (
              <div className="flex items-center gap-3 py-12 text-stone-400">
                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                <span className="text-sm">Validating your cart…</span>
              </div>
            ) : isError ? (
              <div className="py-12 text-center text-sm text-red-500">
                Could not load products. Please refresh and try again.
              </div>
            ) : (
              <>
                <ValidationBanner validations={validations} />

                {step === "details" && (
                  <div className="space-y-10">

                    <section>
                      <SectionHeading>Contact Information</SectionHeading>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="First Name"
                          name="firstName"
                          span="half"
                          placeholder="Jane"
                          value={form.firstName}
                          error={errors.firstName}
                          onChange={(v) => updateField("firstName", v)}
                        />
                        <FormField
                          label="Last Name"
                          name="lastName"
                          span="half"
                          placeholder="Doe"
                          value={form.lastName}
                          error={errors.lastName}
                          onChange={(v) => updateField("lastName", v)}
                        />
                        <FormField
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          error={errors.email}
                          onChange={(v) => updateField("email", v)}
                        />
                        <FormField
                          label="Phone"
                          name="phone"
                          type="tel"
                          placeholder="+977 98XXXXXXXX"
                          value={form.phone}
                          error={errors.phone}
                          onChange={(v) => updateField("phone", v)}
                        />
                      </div>
                    </section>

                    <section>
                      <SectionHeading>Shipping Address</SectionHeading>

                      {savedAddresses.length > 0 && (
                        <div className="space-y-2 mb-6">
                          {savedAddresses.map((savedAddress) => (
                            <label
                              key={savedAddress.id}
                              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all group
                                ${selectedSavedAddressId === savedAddress.id
                                  ? "border-stone-800 bg-stone-50"
                                  : "border-stone-200 bg-white hover:border-stone-300"
                                }`}
                            >
                              <div
                                className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                                  ${selectedSavedAddressId === savedAddress.id ? "border-stone-800" : "border-stone-300"}`}
                              >
                                {selectedSavedAddressId === savedAddress.id && (
                                  <div className="w-2 h-2 rounded-full bg-stone-800" />
                                )}
                              </div>
                              <input
                                type="radio"
                                className="sr-only"
                                checked={selectedSavedAddressId === savedAddress.id}
                                onChange={() => applySavedAddress(savedAddress)}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800">{savedAddress.label}</p>
                                <p className="text-xs text-stone-400 mt-0.5">
                                  {[savedAddress.addressLine2, savedAddress.city, savedAddress.stateProvince, savedAddress.postalCode]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteSavedAddress(savedAddress.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-300 hover:text-red-400 cursor-pointer"
                                aria-label="Remove address"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </label>
                          ))}

                          <label
                            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all
                              ${selectedSavedAddressId === null
                                ? "border-stone-800 bg-stone-50"
                                : "border-stone-200 bg-white hover:border-stone-300"
                              }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                                ${selectedSavedAddressId === null ? "border-stone-800" : "border-stone-300"}`}
                            >
                              {selectedSavedAddressId === null && (
                                <div className="w-2 h-2 rounded-full bg-stone-800" />
                              )}
                            </div>
                            <input
                              type="radio"
                              className="sr-only"
                              checked={selectedSavedAddressId === null}
                              onChange={() => {
                                setSelectedSavedAddressId(null);
                                setForm((prev) => ({
                                  ...prev,
                                  addressLine1: "",
                                  addressLine2: "",
                                  city: "",
                                  stateProvince: "",
                                  postalCode: "",
                                }));
                              }}
                            />
                            <p className="text-sm font-medium text-stone-800">Use a new address</p>
                          </label>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Address Line 1"
                          name="addressLine1"
                          placeholder="123 Main Street"
                          value={form.addressLine1}
                          error={errors.addressLine1}
                          onChange={(v) => updateField("addressLine1", v)}
                        />
                        <FormField
                          label="Address Line 2 (Identification)"
                          name="addressLine2"
                          placeholder="Apartment, floor, landmark…"
                          value={form.addressLine2}
                          error={errors.addressLine2}
                          onChange={(v) => updateField("addressLine2", v)}
                        />
                        <FormField
                          label="City"
                          name="city"
                          span="half"
                          placeholder="Kathmandu"
                          value={form.city}
                          error={errors.city}
                          onChange={(v) => updateField("city", v)}
                        />
                        <FormField
                          label="State / Province"
                          name="stateProvince"
                          span="half"
                          placeholder="Bagmati"
                          value={form.stateProvince}
                          error={errors.stateProvince}
                          onChange={(v) => updateField("stateProvince", v)}
                        />
                        <FormField
                          label="Postal Code"
                          name="postalCode"
                          span="half"
                          placeholder="44600"
                          value={form.postalCode}
                          error={errors.postalCode}
                          onChange={(v) => updateField("postalCode", v)}
                        />

                        <div className="col-span-2 flex items-center gap-2.5">
                          <Checkbox
                            id="saveAddress"
                            checked={saveForLater}
                            onCheckedChange={(checked) => setSaveForLater(checked === true)}
                          />
                          <Label
                            htmlFor="saveAddress"
                            className="text-sm text-stone-600 font-normal cursor-pointer"
                          >
                            Save this address for future orders
                          </Label>
                        </div>

                        <div className="col-span-2">
                          <Label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                            Order Notes <span className="normal-case font-normal">(optional)</span>
                          </Label>
                          <Textarea
                            rows={3}
                            placeholder="Any special instructions..."
                            value={form.notes}
                            onChange={(e) => updateField("notes", e.target.value)}
                            className="resize-none"
                          />
                        </div>
                      </div>
                    </section>

                    <div>
                      <Button
                        onClick={() => { if (validate()) setStep("payment"); }}
                        disabled={!canProceed}
                        className="w-full"
                      >
                        Continue to Payment
                      </Button>
                      {!canProceed && cart.length > 0 && (
                        <p className="mt-2 text-center text-xs text-red-500">
                          Remove unavailable items to proceed
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-8">
                    <button
                      onClick={() => setStep("details")}
                      className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      Back
                    </button>

                    <section>
                      <SectionHeading>Payment Method</SectionHeading>
                      <div className="space-y-3">
                        {(["Online", "Cash on Delivery"] as const).map((method) => (
                          <label
                            key={method}
                            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all
                              ${form.paymentMethod === method
                                ? "border-stone-800 bg-stone-50"
                                : "border-stone-200 bg-white hover:border-stone-300"
                              }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                                ${form.paymentMethod === method ? "border-stone-800" : "border-stone-300"}`}
                            >
                              {form.paymentMethod === method && (
                                <div className="w-2 h-2 rounded-full bg-stone-800" />
                              )}
                            </div>
                            <input
                              type="radio"
                              className="sr-only"
                              checked={form.paymentMethod === method}
                              onChange={() => setForm((prev) => ({ ...prev, paymentMethod: method }))}
                            />
                            <div>
                              <p className="text-sm font-medium text-stone-800">{method}</p>
                              <p className="text-xs text-stone-400">
                                {method === "Online"
                                  ? "Pay securely via eSewa, card or bank transfer"
                                  : "Pay in cash when your order arrives"}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </section>

                    <div className="rounded-2xl bg-stone-50 border border-stone-100 p-4 text-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
                        Delivering to
                      </p>
                      <p className="text-stone-800 font-medium">{form.firstName} {form.lastName}</p>
                      <p className="text-stone-500">
                        {[form.addressLine1, form.addressLine2, form.city, form.stateProvince, form.postalCode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="text-stone-500">{form.email} · {form.phone}</p>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isPlacing}
                      className="w-full"
                    >
                      {isPlacing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Placing Order…
                        </span>
                      ) : (
                        `Place Order · Rs. ${grandTotal.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
                Order Summary
              </p>

              <div className="rounded-2xl bg-white border border-stone-100 overflow-hidden">
                <div className="px-5 divide-y divide-stone-50">
                  {isPending ? (
                    <div className="py-8 flex items-center justify-center gap-2 text-stone-400">
                      <div className="w-4 h-4 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
                      <span className="text-xs">Loading…</span>
                    </div>
                  ) : mergedItems.length === 0 ? (
                    <div className="py-8 text-center text-sm text-stone-400">Your cart is empty</div>
                  ) : (
                    mergedItems.map((item) => {
                      if (!item.product) return null;
                      const validation = validations.find((v) => v.cartItemId === item.cartItemId);
                      return (
                        <OrderSummaryItem
                          key={item.cartItemId}
                          cartItem={item}
                          product={item.product}
                          validation={validation}
                        />
                      );
                    })
                  )}
                </div>

                <div className="px-5 py-4 bg-stone-50 border-t border-stone-100 space-y-2">
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Subtotal</span>
                    <span className="tabular-nums">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 font-medium">Free</span>
                      ) : (
                        `Rs. ${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-[11px] text-stone-400">Free shipping on orders over Rs. 2,000</p>
                  )}
                  <div className="flex justify-between text-sm font-semibold text-stone-800 pt-2 border-t border-stone-200">
                    <span>Total</span>
                    <span className="tabular-nums">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.002-.49-3.89-1.356-5.546" />
                  </svg>
                  Secure checkout
                </span>
                <span className="text-stone-200">·</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  Free returns
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}