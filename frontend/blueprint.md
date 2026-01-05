# Blueprint: PZU (Plataforma de Zeladoria Urbana)

## Visão Geral

Este documento descreve o plano de desenvolvimento para o MVP da PZU, uma GovTech focada em permitir que cidadãos reportem problemas urbanos para a prefeitura. A aplicação será construída com React (Vite, TypeScript) e seguirá as melhores práticas de desenvolvimento frontend.

## Stack Tecnológica

*   **Framework:** React (com Vite e TypeScript)
*   **Estilização:** Tailwind CSS
*   **Componentes:** shadcn/ui
*   **Ícones:** Lucide React
*   **Roteamento:** React Router DOM
*   **Comunicação API:** Axios

## Plano de Ação

### Fase 1: Configuração e Estrutura do Projeto

1.  **Instalar Dependências:** Adicionar `tailwindcss`, `react-router-dom`, `axios` e `lucide-react`.
2.  **Configurar Tailwind CSS:** Inicializar e configurar o Tailwind para o projeto.
3.  **Estruturar Diretórios:** Criar uma estrutura de pastas escalável (`pages`, `components`, `lib`, `services`).
4.  **Configurar Roteamento:** Implementar o roteamento principal da aplicação com `react-router-dom`.

### Fase 2: Desenvolvimento das Funcionalidades

1.  **Página de Login/Cadastro:**
    *   Criar formulários de autenticação.
    *   Implementar a lógica de armazenamento seguro do token JWT (LocalStorage).
2.  **Dashboard do Cidadão:**
    *   Criar a interface para listar os problemas reportados.
    *   Implementar a exibição do status de cada chamado.
    *   Utilizar componentes de card para uma visualização clara.
3.  **Formulário de Reporte:**
    *   Desenvolver o formulário com os campos: `Categoria` (Select), `Descrição` (Textarea) e `Endereço` (Input).
    *   Implementar a lógica de envio do formulário para a API.

### Fase 3: Design, Acessibilidade e Polimento

1.  **Estilização e UI:** Aplicar um design limpo, moderno e responsivo (Mobile First) com Tailwind CSS e `shadcn/ui`.
2.  **Acessibilidade (A11Y):** Garantir que todos os componentes sejam acessíveis, seguindo as diretrizes do WAI-ARIA.
3.  **Ícones e Feedback Visual:** Integrar `lucide-react` para melhorar a experiência do usuário e fornecer feedback visual claro.

### Fase 4: Integração e Testes

1.  **Serviços de API:** Criar um service layer com Axios para encapsular a comunicação com o backend.
2.  **Testes (Futuro):** Planejar a implementação de testes unitários e de integração com Vitest e React Testing Library.

Este blueprint será atualizado continuamente para refletir o estado atual do projeto.
