import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { RichTextEditor } from '@/components/rich-text-editor';

interface KebijakanContent {
    id: number;
    hero_badge: string;
    hero_title: string;
    hero_subtitle: string | null;
    hero_image: string | null;
    intro_title: string | null;
    intro_content: string | null;
    bullying_title: string | null;
    bullying_content: string | null;
    bullying_points: string[];
    bullying_image: string | null;
    lgbt_title: string | null;
    lgbt_content: string | null;
    lgbt_points: string[];
    lgbt_image: string | null;
    environment_title: string | null;
    environment_content: string | null;
    environment_features: string[];
    environment_image: string | null;
    commitment_title: string | null;
    commitment_content: string | null;
    commitment_items: string[];
    order: number;
    is_active: boolean;
}

interface Props {
    content: KebijakanContent;
}

export default function Edit({ content }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Kebijakan & Norma', href: '/admin/kebijakan-content' },
        { label: 'Edit Konten', href: `/admin/kebijakan-content/${content.id}/edit` },
    ];

    // Parse array safely - convert any objects to strings
    const parseArray = (value: any): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value.map(item => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item !== null) {
                    return JSON.stringify(item);
                }
                return String(item || '');
            });
        }
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parseArray(parsed) : [];
            } catch {
                return [];
            }
        }
        return [];
    };

    const { data, setData, post, processing, errors } = useForm({
        hero_badge: content.hero_badge || '',
        hero_title: content.hero_title || '',
        hero_subtitle: content.hero_subtitle || '',
        hero_image: null as File | null,
        intro_title: content.intro_title || '',
        intro_content: content.intro_content || '',
        bullying_title: content.bullying_title || '',
        bullying_content: content.bullying_content || '',
        bullying_points: parseArray(content.bullying_points),
        bullying_image: null as File | null,
        lgbt_title: content.lgbt_title || '',
        lgbt_content: content.lgbt_content || '',
        lgbt_points: parseArray(content.lgbt_points),
        lgbt_image: null as File | null,
        environment_title: content.environment_title || '',
        environment_content: content.environment_content || '',
        environment_features: parseArray(content.environment_features),
        environment_image: null as File | null,
        commitment_title: content.commitment_title || '',
        commitment_content: content.commitment_content || '',
        commitment_items: parseArray(content.commitment_items),
        order: content.order || 1,
        is_active: content.is_active ?? true,
        _method: 'PUT',
    });

    // Image previews
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
    const [bullyingImagePreview, setBullyingImagePreview] = useState<string | null>(null);
    const [lgbtImagePreview, setLgbtImagePreview] = useState<string | null>(null);
    const [environmentImagePreview, setEnvironmentImagePreview] = useState<string | null>(null);

    // Temporary inputs for arrays
    const [newBullyingPoint, setNewBullyingPoint] = useState('');
    const [newLgbtPoint, setNewLgbtPoint] = useState('');
    const [newEnvironmentFeature, setNewEnvironmentFeature] = useState('');
    const [newCommitmentItem, setNewCommitmentItem] = useState('');

    const handleImageChange = (
        field: 'hero_image' | 'bullying_image' | 'lgbt_image' | 'environment_image',
        setPreview: (preview: string | null) => void
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Array manipulation functions
    const addBullyingPoint = () => {
        if (newBullyingPoint.trim()) {
            setData('bullying_points', [...data.bullying_points, newBullyingPoint.trim()]);
            setNewBullyingPoint('');
        }
    };

    const removeBullyingPoint = (index: number) => {
        setData('bullying_points', data.bullying_points.filter((_, i) => i !== index));
    };

    const addLgbtPoint = () => {
        if (newLgbtPoint.trim()) {
            setData('lgbt_points', [...data.lgbt_points, newLgbtPoint.trim()]);
            setNewLgbtPoint('');
        }
    };

    const removeLgbtPoint = (index: number) => {
        setData('lgbt_points', data.lgbt_points.filter((_, i) => i !== index));
    };

    const addEnvironmentFeature = () => {
        if (newEnvironmentFeature.trim()) {
            setData('environment_features', [...data.environment_features, newEnvironmentFeature.trim()]);
            setNewEnvironmentFeature('');
        }
    };

    const removeEnvironmentFeature = (index: number) => {
        setData('environment_features', data.environment_features.filter((_, i) => i !== index));
    };

    const addCommitmentItem = () => {
        if (newCommitmentItem.trim()) {
            setData('commitment_items', [...data.commitment_items, newCommitmentItem.trim()]);
            setNewCommitmentItem('');
        }
    };

    const removeCommitmentItem = (index: number) => {
        setData('commitment_items', data.commitment_items.filter((_, i) => i !== index));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/kebijakan-content/${content.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${content.hero_title}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/kebijakan-content">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Konten Kebijakan</h1>
                        <p className="text-sm text-muted-foreground">
                            Update: {content.hero_title}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Hero Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Hero Section</h3>
                        
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hero_badge">Badge *</Label>
                                <Input
                                    id="hero_badge"
                                    value={data.hero_badge}
                                    onChange={(e) => setData('hero_badge', e.target.value)}
                                    placeholder="KEBIJAKAN & NORMA"
                                    required
                                />
                                {errors.hero_badge && (
                                    <p className="text-sm text-red-500">{errors.hero_badge}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hero_title">Title *</Label>
                                <Input
                                    id="hero_title"
                                    value={data.hero_title}
                                    onChange={(e) => setData('hero_title', e.target.value)}
                                    placeholder="Imam Hafsh Tanpa Bullying & LGBT"
                                    required
                                />
                                {errors.hero_title && (
                                    <p className="text-sm text-red-500">{errors.hero_title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hero_subtitle">Subtitle</Label>
                                <Textarea
                                    id="hero_subtitle"
                                    value={data.hero_subtitle}
                                    onChange={(e) => setData('hero_subtitle', e.target.value)}
                                    placeholder="Komitmen kami untuk menciptakan lingkungan..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hero_image">Hero Image</Label>
                                {content.hero_image && !heroImagePreview && (
                                    <div className="mb-2">
                                        <p className="text-sm text-muted-foreground mb-1">Current image:</p>
                                        <img
                                            src={content.hero_image.startsWith('http') ? content.hero_image : `/storage/${content.hero_image}`}
                                            alt="Current"
                                            className="h-48 w-full rounded object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="hero_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange('hero_image', setHeroImagePreview)}
                                />
                                {heroImagePreview && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">New image:</p>
                                        <img
                                            src={heroImagePreview}
                                            alt="Preview"
                                            className="mt-2 h-48 w-full rounded object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Introduction Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Introduction Section</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="intro_title">Title</Label>
                            <Input
                                id="intro_title"
                                value={data.intro_title}
                                onChange={(e) => setData('intro_title', e.target.value)}
                                placeholder="Pendahuluan"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="intro_content">Content</Label>
                            <RichTextEditor
                                content={data.intro_content}
                                onChange={(value) => setData('intro_content', value)}
                            />
                        </div>
                    </div>

                    {/* Anti-Bullying Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Anti-Bullying Section</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="bullying_title">Title</Label>
                            <Input
                                id="bullying_title"
                                value={data.bullying_title}
                                onChange={(e) => setData('bullying_title', e.target.value)}
                                placeholder="Melawan Bullying"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bullying_content">Content</Label>
                            <RichTextEditor
                                content={data.bullying_content}
                                onChange={(value) => setData('bullying_content', value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Bullying Points</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newBullyingPoint}
                                    onChange={(e) => setNewBullyingPoint(e.target.value)}
                                    placeholder="Tambah poin anti-bullying"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addBullyingPoint();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addBullyingPoint}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2 space-y-2">
                                {data.bullying_points.map((point, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                                        <span className="flex-1">{point}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeBullyingPoint(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bullying_image">Bullying Image</Label>
                            {content.bullying_image && !bullyingImagePreview && (
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground mb-1">Current image:</p>
                                    <img
                                        src={content.bullying_image.startsWith('http') ? content.bullying_image : `/storage/${content.bullying_image}`}
                                        alt="Current"
                                        className="h-48 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                            <Input
                                id="bullying_image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange('bullying_image', setBullyingImagePreview)}
                            />
                            {bullyingImagePreview && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">New image:</p>
                                    <img
                                        src={bullyingImagePreview}
                                        alt="Preview"
                                        className="mt-2 h-48 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Anti-LGBT Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Anti-LGBT Section</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="lgbt_title">Title</Label>
                            <Input
                                id="lgbt_title"
                                value={data.lgbt_title}
                                onChange={(e) => setData('lgbt_title', e.target.value)}
                                placeholder="Kebijakan Anti-LGBT"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lgbt_content">Content</Label>
                            <RichTextEditor
                                content={data.lgbt_content}
                                onChange={(value) => setData('lgbt_content', value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>LGBT Policy Points</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newLgbtPoint}
                                    onChange={(e) => setNewLgbtPoint(e.target.value)}
                                    placeholder="Tambah poin kebijakan LGBT"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addLgbtPoint();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addLgbtPoint}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2 space-y-2">
                                {data.lgbt_points.map((point, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                                        <span className="flex-1">{point}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLgbtPoint(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lgbt_image">LGBT Section Image</Label>
                            {content.lgbt_image && !lgbtImagePreview && (
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground mb-1">Current image:</p>
                                    <img
                                        src={content.lgbt_image.startsWith('http') ? content.lgbt_image : `/storage/${content.lgbt_image}`}
                                        alt="Current"
                                        className="h-48 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                            <Input
                                id="lgbt_image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange('lgbt_image', setLgbtImagePreview)}
                            />
                            {lgbtImagePreview && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">New image:</p>
                                    <img
                                        src={lgbtImagePreview}
                                        alt="Preview"
                                        className="mt-2 h-48 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Safe Environment Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Safe Environment Section</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="environment_title">Title</Label>
                            <Input
                                id="environment_title"
                                value={data.environment_title}
                                onChange={(e) => setData('environment_title', e.target.value)}
                                placeholder="Lingkungan Aman & Nyaman"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="environment_content">Content</Label>
                            <RichTextEditor
                                content={data.environment_content}
                                onChange={(value) => setData('environment_content', value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Environment Features</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newEnvironmentFeature}
                                    onChange={(e) => setNewEnvironmentFeature(e.target.value)}
                                    placeholder="Tambah fitur lingkungan (format: icon|title|description)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addEnvironmentFeature();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addEnvironmentFeature}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Format: shield-check|Title|Description
                            </p>
                            <div className="mt-2 space-y-2">
                                {data.environment_features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                                        <span className="flex-1 text-sm">{feature}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeEnvironmentFeature(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="environment_image">Environment Image</Label>
                            {content.environment_image && !environmentImagePreview && (
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground mb-1">Current image:</p>
                                    <img
                                        src={content.environment_image.startsWith('http') ? content.environment_image : `/storage/${content.environment_image}`}
                                        alt="Current"
                                        className="h-48 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                            <Input
                                id="environment_image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange('environment_image', setEnvironmentImagePreview)}
                            />
                            {environmentImagePreview && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">New image:</p>
                                    <img
                                        src={environmentImagePreview}
                                        alt="Preview"
                                        className="mt-2 h-48 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Commitment Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Commitment Section</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="commitment_title">Title</Label>
                            <Input
                                id="commitment_title"
                                value={data.commitment_title}
                                onChange={(e) => setData('commitment_title', e.target.value)}
                                placeholder="Komitmen Kami"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="commitment_content">Content</Label>
                            <RichTextEditor
                                content={data.commitment_content}
                                onChange={(value) => setData('commitment_content', value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Commitment Items</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newCommitmentItem}
                                    onChange={(e) => setNewCommitmentItem(e.target.value)}
                                    placeholder="Tambah item komitmen"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addCommitmentItem();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addCommitmentItem}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2 space-y-2">
                                {data.commitment_items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                                        <span className="flex-1">{item}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCommitmentItem(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Pengaturan</h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="order">Urutan Tampil</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 1)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="is_active" className="!mt-0">
                                        Aktif
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/kebijakan-content">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Konten'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
