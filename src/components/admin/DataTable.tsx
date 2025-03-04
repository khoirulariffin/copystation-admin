
import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onEdit,
  onDelete
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No items found</p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="text-left">
            {columns.map((column, index) => (
              <th key={index} className="p-4 font-medium text-muted-foreground">
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="p-4 font-medium text-muted-foreground">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-t">
              {columns.map((column, index) => (
                <td key={index} className="p-4">
                  {column.cell 
                    ? column.cell(item) 
                    : typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor] || '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="p-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(item)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
