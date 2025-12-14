import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AdminSweetCard } from '@/components/admin/AdminSweetCard';
import { SweetForm } from '@/components/admin/SweetForm';
import { useSweets, useCreateSweet, useUpdateSweet, useDeleteSweet, useRestockSweet } from '@/hooks/useSweets';
import { useAuth } from '@/contexts/AuthContext';
import { Sweet } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Package, Loader2 } from 'lucide-react';

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { data: sweets, isLoading } = useSweets();
  const createMutation = useCreateSweet();
  const updateMutation = useUpdateSweet();
  const deleteMutation = useDeleteSweet();
  const restockMutation = useRestockSweet();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [restockingId, setRestockingId] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleCreate = async (data: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    await createMutation.mutateAsync(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingSweet) return;
    await updateMutation.mutateAsync({ id: editingSweet.id, ...data });
    setEditingSweet(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestock = async (id: string, quantity: number) => {
    setRestockingId(id);
    try {
      await restockMutation.mutateAsync({ id, quantity });
    } finally {
      setRestockingId(null);
    }
  };

  const openCreateForm = () => {
    setEditingSweet(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your sweet inventory</p>
          </div>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sweet
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : sweets?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sweets.map((sweet) => (
              <AdminSweetCard
                key={sweet.id}
                sweet={sweet}
                onEdit={() => openEditForm(sweet)}
                onDelete={() => handleDelete(sweet.id)}
                onRestock={(quantity) => handleRestock(sweet.id, quantity)}
                isDeleting={deletingId === sweet.id}
                isRestocking={restockingId === sweet.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">No sweets yet</h3>
            <p className="mt-2 text-muted-foreground">
              Add your first sweet to get started.
            </p>
            <Button onClick={openCreateForm} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Sweet
            </Button>
          </div>
        )}
      </main>

      <SweetForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingSweet ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={editingSweet}
      />
    </div>
  );
}
