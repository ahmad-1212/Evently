import { useEffect, useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ICategory } from '@/lib/database/models/category.model';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  createCategory,
  getAllCategories,
} from '@/lib/actions/category.actions';

type DropdownProps = {
  value: string;
  onChangeHandler?: (value: string) => void;
};

const Dropdown = ({ onChangeHandler, value }: DropdownProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isPending, startTransition] = useTransition();
  console.log(isPending);
  const handleAddCategory = () => {
    startTransition(() => {
      createCategory({ categoryName: newCategory.trim() })
        .then(category => {
          setCategories(prevState => [...prevState, category]);
        })
        .catch(err => console.log('Error', err));
    });
  };

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as ICategory[]);
    };
    getCategories();
  }, []);

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map(category => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        <Dialog>
          <DialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add new category
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
              <DialogDescription>
                <Input
                  type="text"
                  placeholder="Categoy name"
                  className="input-field mt-3"
                  onChange={e => setNewCategory(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                disabled={isPending}
                type="submit"
                onClick={() => startTransition(handleAddCategory)}
              >
                {isPending ? 'Adding...' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
