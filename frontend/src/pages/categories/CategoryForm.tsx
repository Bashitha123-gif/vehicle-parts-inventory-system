import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Category, CategoryPayload, Status } from "@/types/category";

export interface CategoryFormProps {
  open: boolean;
  category: Category | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (payload: CategoryPayload) => void;
}

export function CategoryForm({ open, category, saving, onClose, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("ACTIVE");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    setStatus(category?.status ?? "ACTIVE");
    setError(undefined);
  }, [open, category]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim(), status });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? "Edit category" : "Add category"}
      description="Categories group parts such as brakes, filters or electricals."
      footer={
        <>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="category-form" type="submit" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          name="name"
          label="Category name"
          placeholder="e.g. Brake System"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={error}
        />
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short description of the parts in this category"
            className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:border-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-900/10"
          />
        </div>
        <Select
          name="status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as Status)}
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ]}
        />
      </form>
    </Modal>
  );
}
