import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Ticket {
  id: string;
  category: string;
  description: string;
  address: string;
  status: 'PENDENTE' | 'EM_ANALISE' | 'RESOLVIDO';
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const AdminDashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { logout } = useAuth();
  const { success, error: showError } = useToastContext();

  const fetchTickets = async () => {
    try {
      const response = await api.get('/admin/tickets');
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (error: any) {
      showError(error?.message || 'Erro ao carregar chamados');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await api.patch(`/admin/tickets/${ticketId}/status`, {
        status: newStatus
      });
      // Atualiza a lista localmente para refletir a mudança
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t));
      success('Status atualizado com sucesso!');
    } catch (error: any) {
      showError(error?.message || 'Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EM_ANALISE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVIDO': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    try {
      logout();
      window.location.href = '/';
    } catch (error) {
      showError('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Chamados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3">Cidadão</th>
                    <th className="px-6 py-3">Categoria</th>
                    <th className="px-6 py-3">Descrição</th>
                    <th className="px-6 py-3">Endereço</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{ticket.user.name}</div>
                        <div className="text-xs text-gray-500">{ticket.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={ticket.description}>
                        {ticket.description}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {ticket.address}
                      </td>
                      <td className="px-6 py-4">
                        <Select 
                          defaultValue={ticket.status} 
                          onValueChange={(value) => handleStatusChange(ticket.id, value)}
                        >
                          <SelectTrigger className={`w-[140px] border ${getStatusColor(ticket.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDENTE">Pendente</SelectItem>
                            <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
                            <SelectItem value="RESOLVIDO">Resolvido</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Nenhum chamado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
