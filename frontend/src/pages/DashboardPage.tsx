import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToastContext } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { PlusCircle, Loader2, MapPin, Calendar, Activity, LogOut } from "lucide-react";

interface Ticket {
  id: string;
  category: string;
  description: string;
  address: string;
  status: 'PENDENTE' | 'EM_ANALISE' | 'RESOLVIDO';
  createdAt: string;
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { error: showError } = useToastContext();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets");
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (error: any) {
      showError(error?.message || "Erro ao carregar chamados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVIDO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EM_ANALISE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">PZU</h1>
            <span className="text-sm text-gray-500 hidden sm:inline">| Plataforma de Zeladoria Urbana</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">Olá, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meus Chamados</h2>
            <p className="text-gray-500 mt-1">Acompanhe o status das suas solicitações</p>
          </div>
          <Button onClick={() => navigate("/report")} className="shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Chamado
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tickets.length === 0 ? (
          <Card className="text-center py-12 bg-white/50 border-dashed">
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nenhum chamado encontrado</h3>
              <p className="text-gray-500 mb-6">Você ainda não registrou nenhuma ocorrência.</p>
              <Button variant="outline" onClick={() => navigate("/report")}>
                Registrar Primeiro Chamado
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 bg-gray-50/50 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg font-semibold">{ticket.category}</CardTitle>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <CardDescription className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Registrado em {formatDate(ticket.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded border">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                    <span className="truncate">{ticket.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
