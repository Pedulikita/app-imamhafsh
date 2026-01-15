import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  button_text: string | null;
  button_link: string | null;
  order: number;
  is_active: boolean;
}

interface PageProps {
  slide: HeroSlide;
  [key: string]: unknown;
}

export default function HeroSlidesEdit() {
  const { slide } = usePage<PageProps>().props;
  const [formData, setFormData] = useState({
    title: slide.title,
    subtitle: slide.subtitle || '',
    button_text: slide.button_text || '',
    button_link: slide.button_link || '',
    order: slide.order,
    is_active: slide.is_active,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('button_text', formData.button_text);
    data.append('button_link', formData.button_link);
    data.append('order', formData.order.toString());
    data.append('is_active', formData.is_active ? '1' : '0');
    data.append('_method', 'PUT');
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    router.post(`/hero-slides/${slide.id}`, data, {
      forceFormData: true,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Edit Hero Slide" />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Hero Slide</h1>
            <p className="text-gray-600 mt-2">Update hero slide for homepage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Slide Information</CardTitle>
                <CardDescription>Update the details for the hero slide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Welcome to Our School"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter subtitle or description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Hero Image</Label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {/* Current Image */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>

                        {/* Upload New Image */}
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Click to upload new image</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 2MB)</p>
                          </div>
                          <input
                            id="image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      placeholder="e.g., Learn More"
                    />
                  </div>

                  <div>
                    <Label htmlFor="button_link">Button Link</Label>
                    <Input
                      id="button_link"
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                      placeholder="e.g., /about"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Active (show on homepage)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.get('/hero-slides')}
              >
                Cancel
              </Button>
              <Button type="submit">Update Slide</Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
