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
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery, useAction } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GripVertical, Package, LayoutDashboard, Trash2, RefreshCw } from "lucide-react";
import ProductManager from "@/components/ProductManager";

const HERO_GROUPS = [
  {
    slug: "hero-one",
    label: "Hero Section 1 (Main Banner)",
    description: "Displayed at the top of the landing page hero component.",
  },
  {
    slug: "hero-two",
    label: "Hero Section 2",
    description: "Use for mid-page promotional storytelling.",
  },
  {
    slug: "hero-three",
    label: "Hero Section 3",
    description: "Ideal for campaigns or seasonal highlights.",
  },
] as const;

export default function Admin() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user } = useAuth();
  
  // Hero & Stats queries
  const productStats = useQuery(api.products.getProductCountByCategory);
  const heroSectionsData = useQuery(api.heroSections.getHeroSections);
  const addHeroSectionImage = useMutation(api.heroSections.addHeroImage);
  const removeHeroSectionImage = useMutation(api.heroSections.removeHeroImage);
  const replaceHeroSectionImage = useMutation(api.heroSections.replaceHeroImage);

  // Auth logic
  const allowedEmails = new Set<string>(["luxe.premium.in@gmail.com"]);
  const isAuthorized =
    !!isAuthenticated &&
    !!user &&
    ((user.role as string | undefined) === "admin" ||
      (user.email ? allowedEmails.has(user.email) : false));

  // View state
  const [view, setView] = useState<"dashboard" | "products">("dashboard");

  // Hero image management state
  const [heroUploading, setHeroUploading] = useState<Record<string, boolean>>({});
  const [replacingImage, setReplacingImage] = useState<{ slug: string; oldUrl: string } | null>(null);

  // Convex storage actions
  const generateUploadUrl = useAction((api as any).storage.generateUploadUrl);
  const resolvePublicUrl = useAction((api as any).storage.resolvePublicUrl);

  const handleHeroImagesUpload = async (
    slug: string,
    title: string,
    fileList: FileList | null,
  ) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      toast.error("Please upload image files only.");
      return;
    }

    const ignored = fileList.length - imageFiles.length;
    if (ignored > 0) {
      toast(
        `Ignored ${ignored} file${ignored > 1 ? "s" : ""} that were not images.`,
      );
    }

    setHeroUploading((prev) => ({ ...prev, [slug]: true }));

    try {
      let successCount = 0;

      for (const file of imageFiles) {
        const postUrl: string = await generateUploadUrl({});
        const res = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const json = (await res.json()) as { storageId: string };
        const publicUrl: string = await resolvePublicUrl({
          storageId: json.storageId as any,
        });

        await addHeroSectionImage({
          slug,
          title,
          imageUrl: publicUrl,
        });

        successCount += 1;
      }

      if (successCount > 0) {
        toast.success(
          `Added ${successCount} image${successCount > 1 ? "s" : ""} to ${title}.`,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload hero images. Please try again.");
    } finally {
      setHeroUploading((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const handleHeroImageReplace = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !replacingImage) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const { slug, oldUrl } = replacingImage;
    setHeroUploading((prev) => ({ ...prev, [slug]: true }));

    try {
      const postUrl: string = await generateUploadUrl({});
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) throw new Error("Upload failed");

      const json = (await res.json()) as { storageId: string };
      const publicUrl: string = await resolvePublicUrl({
        storageId: json.storageId as any,
      });

      await replaceHeroSectionImage({
        slug,
        oldImageUrl: oldUrl,
        newImageUrl: publicUrl,
      });

      toast.success("Image replaced successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to replace image.");
    } finally {
      setHeroUploading((prev) => ({ ...prev, [slug]: false }));
      setReplacingImage(null);
      event.target.value = ""; // Reset input
    }
  };

  const handleHeroImageRemove = async (
    slug: string,
    imageUrl: string,
    label: string,
  ) => {
    if (!confirm(`Remove this image from ${label}?`)) {
      return;
    }

    try {
      await removeHeroSectionImage({ slug, imageUrl });
      toast.success("Hero image removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove hero image.");
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user !== undefined && !isAuthorized) {
      toast("You are not authorized to access Admin.");
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, isAuthorized, navigate]);

  const heroSectionsBySlug = useMemo(() => {
    const map: Record<string, any> = {};
    heroSectionsData?.forEach((section) => {
      map[section.slug] = section;
    });
    return map;
  }, [heroSectionsData]);

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (view === "products") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductManager onBack={() => setView("dashboard")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Hidden input for replacement */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="replace-hero-image-input"
        onChange={handleHeroImageReplace}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage products and view analytics</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
            >
              Back to Site
            </Button>
            <Button
              onClick={() => navigate("/admin/storage-recovery")}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
            >
              Storage Recovery
            </Button>
            <Button
              onClick={() => navigate("/admin/customers")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Customer Analytics
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card 
            className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
            onClick={() => setView("products")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Manage Products
              </CardTitle>
              <CardDescription>Add, edit, and organize inventory</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 mb-4">
                Access full product management suite including bulk uploads and category organization.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Open Product Manager
              </Button>
            </CardContent>
          </Card>

          {productStats && (
            <Card className="border border-gray-200 md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-gray-600" />
                  Inventory Overview
                </CardTitle>
                <CardDescription>Quick snapshot of your stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-1">Total</p>
                    <p className="text-2xl font-bold text-blue-900">{productStats.total}</p>
                  </div>
                  {Object.entries(productStats.byCategory).map(([category, count]) => (
                    <div 
                      key={category}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <p className="text-xs text-gray-600 font-medium mb-1 capitalize">{category}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle>Hero Sections</CardTitle>
            <CardDescription>
              Manage imagery for each hero section on the storefront
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {HERO_GROUPS.map((group) => {
              const section = heroSectionsBySlug[group.slug];
              const images: string[] = section?.images ?? [];

              return (
                <div
                  key={group.slug}
                  className="rounded-lg border border-gray-200 bg-white/70 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {group.label}
                      </h3>
                      <p className="text-sm text-gray-500">{group.description}</p>
                      {section?.title &&
                        section.title.trim() !== "" &&
                        section.title !== group.label && (
                          <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
                            Stored as: {section.title}
                          </p>
                        )}
                    </div>
                    <div className="sm:text-right">
                      <Label htmlFor={`hero-${group.slug}`} className="sr-only">
                        Upload images for {group.label}
                      </Label>
                      <Input
                        id={`hero-${group.slug}`}
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={!!heroUploading[group.slug]}
                        onChange={(event) => {
                          void handleHeroImagesUpload(
                            group.slug,
                            group.label,
                            event.target.files,
                          );
                          event.target.value = "";
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        {heroUploading[group.slug]
                          ? "Uploading..."
                          : "Select one or more images to append to this section."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {images.length === 0 ? (
                      <p className="text-xs italic text-gray-500">
                        No images yet. Upload to populate this hero section.
                      </p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {images.map((imageUrl, index) => (
                          <div
                            key={`${group.slug}-${index}`}
                            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-black/5"
                          >
                            <img
                              src={imageUrl}
                              alt={`${group.label} image ${index + 1}`}
                              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              fetchPriority="low"
                            />
                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-2">
                              <span className="text-xs font-medium text-white">
                                #{index + 1}
                              </span>
                              <div className="flex gap-1.5">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="secondary"
                                  className="h-7 w-7 rounded-full bg-white/80 text-gray-900 hover:bg-white"
                                  onClick={() => {
                                    setReplacingImage({ slug: group.slug, oldUrl: imageUrl });
                                    document.getElementById("replace-hero-image-input")?.click();
                                  }}
                                  disabled={!!heroUploading[group.slug]}
                                  title="Replace image"
                                >
                                  <span className="sr-only">Replace image</span>
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="secondary"
                                  className="h-7 w-7 rounded-full bg-white/80 text-gray-900 hover:bg-white"
                                  onClick={() => {
                                    navigator.clipboard.writeText(imageUrl);
                                    toast.success("Image URL copied!");
                                  }}
                                  title="Copy URL"
                                >
                                  <span className="sr-only">Copy image URL</span>
                                  ⧉
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="h-7 w-7 rounded-full"
                                  onClick={() =>
                                    void handleHeroImageRemove(
                                      group.slug,
                                      imageUrl,
                                      group.label,
                                    )
                                  }
                                  disabled={!!heroUploading[group.slug]}
                                  title="Remove image"
                                >
                                  <span className="sr-only">Remove image</span>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <p className="text-xs text-gray-500">
              Tip: The first image in "Hero Section 1" is used as the primary landing hero
              background. Reorder by removing and re-uploading images in the desired order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}