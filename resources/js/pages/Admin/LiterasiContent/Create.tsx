import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { RichTextEditor } from '@/components/rich-text-editor';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        description: '',
        main_content: '',
        features_title: 'Keunggulan Program Literasi',
        features: [] as Array<{ title: string; description: string; icon?: string }>,
        statistics_title: 'Statistik Literasi',
        statistics: [] as Array<{ label: string; value: string }>,
        image: null as File | null,
        image_path: '',
        gallery_images: [] as string[],
        meta_title: '',
        meta_description: '',
        is_active: true,
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/literasi-content', {
            forceFormData: true,
        });
    };

    const addFeature = () => {
        setData('features', [...data.features, { title: '', description: '', icon: '' }]);
    };

    const updateFeature = (index: number, field: string, value: string) => {
        const updatedFeatures = [...data.features];
        updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
        setData('features', updatedFeatures);
    };

    const removeFeature = (index: number) => {
        const updatedFeatures = data.features.filter((_, i) => i !== index);
        setData('features', updatedFeatures);
    };

    const addStatistic = () => {
        setData('statistics', [...data.statistics, { label: '', value: '' }]);
    };

    const updateStatistic = (index: number, field: string, value: string) => {
        const updatedStatistics = [...data.statistics];
        updatedStatistics[index] = { ...updatedStatistics[index], [field]: value };
        setData('statistics', updatedStatistics);
    };

    const removeStatistic = (index: number) => {
        const updatedStatistics = data.statistics.filter((_, i) => i !== index);
        setData('statistics', updatedStatistics);
    };

    return (
        <AppLayout>
            <Head title="Create Literasi Content" />

            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/literasi-content">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create Literasi Content</h1>
                        <p className="text-muted-foreground">
                            Add new literasi sekolah page content
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Basic content information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter title"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle</Label>
                                <Input
                                    id="subtitle"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="Enter subtitle"
                                />
                                <InputError message={errors.subtitle} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter description"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="main_content">Main Content *</Label>
                                <RichTextEditor
                                    value={data.main_content}
                                    onChange={(value) => setData('main_content', value)}
                                    placeholder="Enter main content"
                                />
                                <InputError message={errors.main_content} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Features Section</CardTitle>
                            <CardDescription>
                                Keunggulan program literasi (opsional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="features_title">Judul Section Features</Label>
                                <Input
                                    id="features_title"
                                    value={data.features_title}
                                    onChange={(e) => setData('features_title', e.target.value)}
                                    placeholder="Keunggulan Program Literasi"
                                />
                                <InputError message={errors.features_title} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Daftar Features</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                        Add Feature
                                    </Button>
                                </div>
                                {data.features.map((feature, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Feature {index + 1}</span>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeFeature(index)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon (emoji)</Label>
                                            <Input
                                                value={feature.icon || ''}
                                                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                placeholder="📚"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={feature.title}
                                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                placeholder="Feature title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={feature.description}
                                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                placeholder="Feature description"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics Section</CardTitle>
                            <CardDescription>
                                Statistik literasi (opsional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="statistics_title">Judul Section Statistics</Label>
                                <Input
                                    id="statistics_title"
                                    value={data.statistics_title}
                                    onChange={(e) => setData('statistics_title', e.target.value)}
                                    placeholder="Statistik Literasi"
                                />
                                <InputError message={errors.statistics_title} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Daftar Statistics</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addStatistic}>
                                        Add Statistic
                                    </Button>
                                </div>
                                {data.statistics.map((stat, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Statistic {index + 1}</span>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeStatistic(index)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Value (angka)</Label>
                                            <Input
                                                value={stat.value}
                                                onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                                                placeholder="1,469+"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Label</Label>
                                            <Input
                                                value={stat.label}
                                                onChange={(e) => updateStatistic(index, 'label', e.target.value)}
                                                placeholder="Total Koleksi Buku"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>
                                Images and media files
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Upload Main Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                />
                                <InputError message={errors.image} />
                                <p className="text-sm text-muted-foreground">
                                    Upload main image for literasi content. Max size: 2MB.
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="image_path">Alternative Image Path</Label>
                                <Input
                                    id="image_path"
                                    value={data.image_path}
                                    onChange={(e) => setData('image_path', e.target.value)}
                                    placeholder="/images/literasi-main.jpg"
                                />
                                <InputError message={errors.image_path} />
                                <p className="text-sm text-muted-foreground">
                                    Optional: Use existing image path if no file is uploaded.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO</CardTitle>
                            <CardDescription>
                                Search engine optimization
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title">Meta Title</Label>
                                <Input
                                    id="meta_title"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder="SEO title"
                                />
                                <InputError message={errors.meta_title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta_description">Meta Description</Label>
                                <Textarea
                                    id="meta_description"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    placeholder="SEO description"
                                    rows={3}
                                />
                                <InputError message={errors.meta_description} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>
                                Content settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Sort Order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order.toString()}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Create Content
                        </Button>
                        <Link href="/admin/literasi-content">
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}