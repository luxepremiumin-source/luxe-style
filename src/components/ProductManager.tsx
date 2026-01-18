import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery, useAction } from "convex/react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { GripVertical, ArrowLeft } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

type GenderOption = "mens" | "womens";
type CategoryOption =
  | "goggles"
  | "watches"
  | "belts"
  | "gift box"
  | "wallets"
  | "handbags";

const CATEGORY_LABELS: Record<CategoryOption, string> = {
  goggles: "Goggles",
  watches: "Watches",
  belts: "Belts",
  "gift box": "Gift Box",
  wallets: "Wallets",
  handbags: "Handbags",
};

const CATEGORY_OPTIONS_BY_GENDER: Record<GenderOption, CategoryOption[]> = {
  mens: ["watches", "wallets", "goggles", "belts"],
  womens: ["handbags", "watches", "goggles", "wallets", "gift box", "belts"],
};

const ALL_CATEGORY_OPTIONS: Array<{ value: CategoryOption; label: string }> = Object.entries(
  CATEGORY_LABELS,
).map(([value, label]) => ({ value: value as CategoryOption, label }));

const COMMON_COLORS = [
  "Black",
  "White",
  "Grey",
  "Brown",
  "Gold",
  "Silver",
  "Blue",
  "Red",
  "Green",
  "Beige",
  "Pink",
  "Purple",
];

type NewProduct = {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: CategoryOption | "";
  targetGender: GenderOption | "";
  images: string; // comma separated
  videos: string; // comma separated
  colors: string[];
  featured: boolean;
  inStock: boolean;
};

type MediaItem = {
  url: string;
  type: "image" | "video";
};

interface ProductManagerProps {
  onBack: () => void;
}

export default function ProductManager({ onBack }: ProductManagerProps) {
  const createProduct = useMutation(api.products.createProduct);
  const products = useQuery(api.products.getAllProducts);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);
  
  const generateUploadUrl = useAction((api as any).storage.generateUploadUrl);
  const resolvePublicUrl = useAction((api as any).storage.resolvePublicUrl);

  const [form, setForm] = useState<NewProduct>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    targetGender: "",
    images: "",
    videos: "",
    colors: [],
    featured: false,
    inStock: true,
  });

  const [newColor, setNewColor] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [editUploadedMedia, setEditUploadedMedia] = useState<MediaItem[]>([]);
  const [uploadingInBackground, setUploadingInBackground] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | CategoryOption>("all");

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editDraggedIndex, setEditDraggedIndex] = useState<number | null>(null);

  // Edit state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    category: CategoryOption | "";
    targetGender: GenderOption | "";
    images: string;
    videos: string;
    colors: string[];
    featured: boolean;
    inStock: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "goggles",
    targetGender: "mens",
    images: "",
    videos: "",
    colors: [],
    featured: false,
    inStock: true,
  });
  const [editNewColor, setEditNewColor] = useState("");

  useEffect(() => {
    const prefilledImages = sessionStorage.getItem("prefilledImages");
    if (prefilledImages) {
      const imageUrls = prefilledImages.split(", ").filter(Boolean);
      const mediaItems: MediaItem[] = imageUrls.map(url => ({
        url,
        type: url.includes('video') ? 'video' : 'image'
      }));
      setUploadedMedia(mediaItems);
      sessionStorage.removeItem("prefilledImages");
      toast.success(`Pre-filled ${imageUrls.length} images from Storage Recovery!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const uploadMediaFiles = async (files: Array<File>, isEdit: boolean = false) => {
    if (!files || files.length === 0) return;
    
    // Compress images before processing
    const processedFiles = await Promise.all(files.map(async (file) => {
      if (file.type.startsWith('image/')) {
        try {
          // Compress to max 1920px width and 0.8 quality
          return await compressImage(file, 0.8, 1920);
        } catch (err) {
          console.error("Image compression failed, using original:", err);
          return file;
        }
      }
      return file;
    }));

    const blobItems: MediaItem[] = processedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    
    if (isEdit) {
      setEditUploadedMedia((prev) => [...prev, ...blobItems]);
    } else {
      setUploadedMedia((prev) => [...prev, ...blobItems]);
    }
    
    setUploadingInBackground(true);
    
    Promise.all(processedFiles.map(async (file, i) => {
      const blobUrl = blobItems[i].url;
      const mediaType = blobItems[i].type;
      
      try {
        const postUrl: string = await generateUploadUrl({});
        const res = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!res.ok) throw new Error("Upload failed");
        const json = (await res.json()) as { storageId: string };
        const publicUrl: string = await resolvePublicUrl({ storageId: json.storageId as any });
        
        const updateFn = isEdit ? setEditUploadedMedia : setUploadedMedia;
        updateFn((prev) => {
          const newArr = [...prev];
          const blobIndex = newArr.findIndex(item => item.url === blobUrl);
          if (blobIndex !== -1) {
            newArr[blobIndex] = { url: publicUrl, type: mediaType };
            URL.revokeObjectURL(blobUrl);
          }
          return newArr;
        });
      } catch (err) {
        console.error("Media upload error:", err);
        const updateFn = isEdit ? setEditUploadedMedia : setUploadedMedia;
        updateFn((prev) => prev.filter(item => item.url !== blobUrl));
        URL.revokeObjectURL(blobUrl);
        toast.error("Upload interrupted. Please try again.");
      }
    })).finally(() => {
      setUploadingInBackground(false);
    });
  };

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await uploadMediaFiles(Array.from(files), false);
    toast("Media uploaded");
  };

  const handleEditFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await uploadMediaFiles(Array.from(files), true);
    toast("Media uploaded");
  };

  const handlePasteUpload = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items || items.length === 0) return;
    const files: Array<File> = [];
    for (const item of Array.from(items)) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
          files.push(file);
        }
      }
    }
    if (files.length === 0) return;
    e.preventDefault();
    await uploadMediaFiles(files, false);
    toast(`Pasted ${files.length} item${files.length > 1 ? "s" : ""}`);
  };

  const handleEditPasteUpload = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items || items.length === 0) return;
    const files: Array<File> = [];
    for (const item of Array.from(items)) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
          files.push(file);
        }
      }
    }
    if (files.length === 0) return;
    e.preventDefault();
    await uploadMediaFiles(files, true);
    toast(`Pasted ${files.length} item${files.length > 1 ? "s" : ""}`);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setUploadedMedia((prev) => {
      const newArr = [...prev];
      const draggedItem = newArr[draggedIndex];
      newArr.splice(draggedIndex, 1);
      newArr.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      return newArr;
    });
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const handleEditDragStart = (index: number) => setEditDraggedIndex(index);
  const handleEditDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (editDraggedIndex === null || editDraggedIndex === index) return;
    setEditUploadedMedia((prev) => {
      const newArr = [...prev];
      const draggedItem = newArr[editDraggedIndex];
      newArr.splice(editDraggedIndex, 1);
      newArr.splice(index, 0, draggedItem);
      setEditDraggedIndex(index);
      return newArr;
    });
  };
  const handleEditDragEnd = () => setEditDraggedIndex(null);

  const handleChange = (key: keyof NewProduct, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value as any }));
  };

  const handleGenderChange = (value: GenderOption) => {
    setForm((prev) => ({ ...prev, targetGender: value, category: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!form.name.trim()) return toast("Please enter a product name.");
    if (!form.description.trim()) return toast("Please enter a product description.");
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) return toast("Please enter a valid price.");

    if (!form.targetGender) return toast("Please select Mens or Womens.");
    if (!form.category) return toast("Please select a category.");

    const hasBlobUrls = uploadedMedia.some(item => item.url.startsWith("blob:"));
    if (hasBlobUrls && uploadingInBackground) {
      toast.info("Uploads are still processing. Product will be saved once uploads complete.");
    }

    setIsSubmitting(true);

    try {
      if (uploadingInBackground) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const cleanedMedia = uploadedMedia
        .filter(item => !item.url.startsWith("blob:"))
        .map(item => ({ ...item, url: item.url.split("?")[0] }));

      const images = cleanedMedia.filter(item => item.type === "image").map(item => item.url);
      const videos = cleanedMedia.filter(item => item.type === "video").map(item => item.url);

      if (images.length === 0) {
        toast.error("Please upload at least one product image.");
        setIsSubmitting(false);
        return;
      }

      await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: priceNum,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category,
        targetGender: form.targetGender || undefined,
        images,
        videos: videos.length > 0 ? videos : undefined,
        colors: form.colors.length > 0 ? form.colors : undefined,
        featured: form.featured,
        inStock: form.inStock,
      });

      toast("Product added successfully!");
      setForm({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        targetGender: "",
        images: "",
        videos: "",
        colors: [],
        featured: false,
        inStock: true,
      });
      setUploadedMedia([]);
      setNewColor("");
    } catch (err) {
      console.error(err);
      toast("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (p: any) => {
    setEditId(p._id);
    setEditForm({
      name: p.name ?? "",
      description: p.description ?? "",
      price: String(p.price ?? ""),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      category: (p.category as any) ?? "goggles",
      targetGender: (p.targetGender as any) ?? "mens",
      images: Array.isArray(p.images) ? p.images.join(", ") : "",
      videos: Array.isArray(p.videos) ? p.videos.join(", ") : "",
      colors: Array.isArray(p.colors) ? p.colors : [],
      featured: !!p.featured,
      inStock: !!p.inStock,
    });

    const initialMedia: MediaItem[] = [
      ...(Array.isArray(p.images) ? p.images.map((url: string) => ({ url, type: 'image' as const })) : []),
      ...(Array.isArray(p.videos) ? p.videos.map((url: string) => ({ url, type: 'video' as const })) : []),
    ];
    setEditUploadedMedia(initialMedia);
    setEditNewColor("");
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editId) return;
    if (uploadingInBackground && editUploadedMedia.some(item => item.url.startsWith("blob:"))) {
      toast.error("Please wait for media uploads to finish.");
      return;
    }

    try {
      setIsSubmitting(true);
      const cleanedMedia = editUploadedMedia
        .filter(item => !item.url.startsWith('blob:'))
        .map(item => ({ ...item, url: item.url.split("?")[0] }));

      const combinedImages = cleanedMedia.filter(item => item.type === 'image').map(item => item.url);
      const combinedVideos = cleanedMedia.filter(item => item.type === 'video').map(item => item.url);

      const payload: any = {
        id: editId as any,
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price: Number(editForm.price),
        originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
        category: editForm.category,
        targetGender: editForm.targetGender || undefined,
        featured: editForm.featured,
        inStock: editForm.inStock,
      };

      if (combinedImages.length > 0) payload.images = combinedImages;
      if (combinedVideos.length > 0) payload.videos = combinedVideos;
      if (editForm.colors.length > 0) payload.colors = editForm.colors;

      await updateProduct(payload);
      toast("Product updated.");
      setIsEditOpen(false);
      setEditId(null);
    } catch (e) {
      console.error(e);
      toast("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Delete "${productName}"?`)) return;
    try {
      setIsSubmitting(true);
      await deleteProduct({ id: productId as any });
      toast("Product deleted");
    } catch (err) {
      console.error(err);
      toast("Failed to delete product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products
    ? selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500">Add, edit, and manage your inventory</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border border-gray-200 h-fit">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Fill details and upload your product.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Classic Chronograph"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Short premium description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Collection</Label>
                <Select
                  value={form.targetGender || undefined}
                  onValueChange={(v) => handleGenderChange(v as GenderOption)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mens or Womens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mens">Mens</SelectItem>
                    <SelectItem value="womens">Womens</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category || undefined}
                  onValueChange={(v) => handleChange("category", v)}
                  disabled={!form.targetGender}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={form.targetGender ? "Select a category" : "Select Mens or Womens first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(form.targetGender ? CATEGORY_OPTIONS_BY_GENDER[form.targetGender] : []).map((value) => (
                      <SelectItem key={value} value={value}>
                        {CATEGORY_LABELS[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload">Upload Images & Videos</Label>
                <Input
                  id="upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => handleFilesUpload(e.target.files)}
                />
                {uploadedMedia.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {uploadedMedia.map((item, idx) => (
                      <div
                        key={item.url + idx}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative cursor-move group ${draggedIndex === idx ? 'opacity-50' : ''}`}
                      >
                        {item.type === 'image' ? (
                          <img src={item.url} className="h-20 w-full object-cover rounded-md border" />
                        ) : (
                          <video src={item.url} className="h-20 w-full object-cover rounded-md border" muted />
                        )}
                        <div className="absolute top-1 left-1 bg-black/80 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 text-[10px] px-2 py-0.5 rounded bg-black/70 text-white"
                          onClick={() => setUploadedMedia((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paste-area">Or paste images/videos (Ctrl/⌘+V)</Label>
                <textarea
                  id="paste-area"
                  onPaste={handlePasteUpload}
                  placeholder="Click here and paste images or videos from clipboard"
                  className="w-full h-16 rounded-md border border-gray-200 p-3 text-sm bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label>Color Options</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COMMON_COLORS.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={form.colors.includes(color) ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        if (!form.colors.includes(color)) {
                          setForm((prev) => ({ ...prev, colors: [...prev.colors, color] }));
                        } else {
                          setForm((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
                        }
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g., Black, White"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newColor.trim()) {
                        e.preventDefault();
                        setForm(prev => ({ ...prev, colors: [...prev.colors, newColor.trim()] }));
                        setNewColor("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newColor.trim()) {
                        setForm(prev => ({ ...prev, colors: [...prev.colors, newColor.trim()] }));
                        setNewColor("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                  <Label className="cursor-pointer">Featured</Label>
                  <Switch checked={form.featured} onCheckedChange={(v) => handleChange("featured", v)} />
                </div>
                <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                  <Label className="cursor-pointer">In Stock</Label>
                  <Switch checked={form.inStock} onCheckedChange={(v) => handleChange("inStock", v)} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 h-fit">
          <CardHeader>
            <CardTitle>Existing Products</CardTitle>
            <CardDescription>Manage your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="category-filter">Filter by Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(v) => setSelectedCategory(v as any)}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ALL_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!products ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No products found.</p>
            ) : (
              <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                {filteredProducts.slice().reverse().map((p) => (
                  <div key={p._id} className="border border-gray-200 rounded-md p-3 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {p.category} • ₹{p.price.toLocaleString()}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(p._id, p.name)}>Delete</Button>
                      </div>
                    </div>
                    {p.images && p.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {p.images.slice(0, 4).map((img, idx) => (
                          <img key={idx} src={img} className="h-12 w-full object-cover rounded border" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Collection</Label>
              <Select
                value={editForm.targetGender || undefined}
                onValueChange={(v) => setEditForm(f => ({ ...f, targetGender: v as GenderOption, category: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Mens or Womens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mens">Mens</SelectItem>
                  <SelectItem value="womens">Womens</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(v) => setEditForm(f => ({ ...f, category: v as any }))}
                disabled={!editForm.targetGender}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editForm.targetGender ? "Select a category" : "Select Mens or Womens first"} />
                </SelectTrigger>
                <SelectContent>
                  {(editForm.targetGender ? CATEGORY_OPTIONS_BY_GENDER[editForm.targetGender] : []).map((value) => (
                    <SelectItem key={value} value={value}>
                      {CATEGORY_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" value={editForm.price} onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input type="number" value={editForm.originalPrice} onChange={(e) => setEditForm(f => ({ ...f, originalPrice: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Options</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {COMMON_COLORS.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant={editForm.colors.includes(color) ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      if (!editForm.colors.includes(color)) {
                        setEditForm((prev) => ({ ...prev, colors: [...prev.colors, color] }));
                      } else {
                        setEditForm((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
                      }
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={editNewColor}
                  onChange={(e) => setEditNewColor(e.target.value)}
                  placeholder="e.g., Black, White"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editNewColor.trim()) {
                      e.preventDefault();
                      setEditForm((prev) => ({ ...prev, colors: [...prev.colors, editNewColor.trim()] }));
                      setEditNewColor("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (editNewColor.trim()) {
                      setEditForm((prev) => ({ ...prev, colors: [...prev.colors, editNewColor.trim()] }));
                      setEditNewColor("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {editForm.colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editForm.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Upload Images & Videos</Label>
              <Input type="file" accept="image/*,video/*" multiple onChange={(e) => handleEditFilesUpload(e.target.files)} />
              {editUploadedMedia.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {editUploadedMedia.map((item, idx) => (
                    <div
                      key={item.url + idx}
                      draggable
                      onDragStart={() => handleEditDragStart(idx)}
                      onDragOver={(e) => handleEditDragOver(e, idx)}
                      onDragEnd={handleEditDragEnd}
                      className={`relative cursor-move group ${editDraggedIndex === idx ? 'opacity-50' : ''}`}
                    >
                      {item.type === 'image' ? (
                        <img src={item.url} className="h-20 w-full object-cover rounded-md border" />
                      ) : (
                        <video src={item.url} className="h-20 w-full object-cover rounded-md border" muted />
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-[10px] px-2 py-0.5 rounded bg-black/70 text-white"
                        onClick={() => setEditUploadedMedia((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={submitEdit} disabled={isSubmitting}>Save changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}