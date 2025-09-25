import { ColumnDef } from '@tanstack/react-table';
import { Participant } from '@/types/participant';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const participantColumns: ColumnDef<Participant>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
        className="totem-checkbox"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Selecionar ${row.original.name}`}
        className="totem-checkbox"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'selfieUrl',
    header: 'Foto',
    cell: ({ row }) => {
      const selfieUrl = row.getValue('selfieUrl') as string | null;
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-foreground shadow-brutal">
          {selfieUrl ? (
            <img
              src={selfieUrl}
              alt={`Foto de ${row.original.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <div className="font-medium totem-text">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string | null;
      return (
        <div className="totem-text text-sm">
          {email || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null;
      return (
        <div className="totem-text text-sm">
          {phone || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Cadastrado em',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="totem-text text-sm">
          {date.toLocaleString('pt-BR')}
        </div>
      );
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      // Por enquanto, todos os participantes estão elegíveis
      return (
        <Badge 
          variant="default" 
          className="totem-badge bg-green-600 text-white"
        >
          Elegível
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="totem-button text-xs"
          onClick={() => {
            // TODO: Implementar visualização de detalhes
            console.log('Ver detalhes:', row.original);
          }}
        >
          Ver
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];
