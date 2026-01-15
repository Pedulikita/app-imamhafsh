import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Upload } from 'lucide-react';

export default function HeroSlidesCreate() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    order: 0,
    is_active: true,
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
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    router.post('/hero-slides', data, {
      forceFormData: true,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create Hero Slide" />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Add Hero Slide</h1>
            <p className="text-gray-600 mt-2">Create a new hero slide for homepage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Slide Information</CardTitle>
                <CardDescription>Enter the details for the hero slide</CardDescription>
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
                  <Label htmlFor="image">Hero Image *</Label>
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
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 2MB)</p>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080px</p>
                        </div>
                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
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
              <Button type="submit">Create Slide</Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
