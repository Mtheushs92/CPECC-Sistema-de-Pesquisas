export const saveToLocal = (collectionName: string, data: any) => {
  const existing = JSON.parse(localStorage.getItem(collectionName) || '[]');
  
  // If it's a profile update (has uid), update or insert
  if (data.uid) {
    const index = existing.findIndex((item: any) => item.uid === data.uid);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...data };
    } else {
      existing.push({ ...data, id: data.uid });
    }
  } else {
    // Normal insert
    existing.push({ ...data, id: Date.now().toString() });
  }
  
  localStorage.setItem(collectionName, JSON.stringify(existing));
  return data;
};

export const getFromLocal = (collectionName: string, queryField?: string, queryValue?: string) => {
  const existing = JSON.parse(localStorage.getItem(collectionName) || '[]');
  if (queryField && queryValue) {
    return existing.filter((item: any) => item[queryField] === queryValue);
  }
  return existing;
};

export const getOneFromLocal = (collectionName: string, id: string) => {
  const existing = JSON.parse(localStorage.getItem(collectionName) || '[]');
  return existing.find((item: any) => item.id === id || item.uid === id);
};

export const removeFromLocal = (collectionName: string, id: string) => {
  const existing = JSON.parse(localStorage.getItem(collectionName) || '[]');
  const updated = existing.filter((item: any) => item.id !== id && item.uid !== id);
  localStorage.setItem(collectionName, JSON.stringify(updated));
  return updated;
};

export const mockUploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Seed mock data for testing
export const seedMockData = (uid?: string) => {
  // Initialize Admin Users if not exists
  const hasAdmins = localStorage.getItem('admins');
  if (!hasAdmins) {
    const defaultAdmins = [
      { id: 'admin-1', username: 'admin', password: 'admin', name: 'Administrador Global', role: 'admin' },
      { id: 'admin-2', username: 'cpecc', password: 'cpecc', name: 'Gestor CPECC', role: 'admin' }
    ];
    localStorage.setItem('admins', JSON.stringify(defaultAdmins));
  }

  // Seeding researchers if not exists
  const hasResearchers = localStorage.getItem('researchers');
  if (!hasResearchers) {
    const defaultResearchers = [
      {
        uid: 'user-123',
        id: 'user-123',
        nome: 'Dr. Ricardo Santos',
        cpf: '123.456.789-00',
        email_inst: 'ricardo.santos@instituicao.edu.br',
        status: 'Ativo',
        lattes: 'http://lattes.cnpq.br/123456789',
        area: 'Medicina',
        titulacao: 'Doutorado',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'user-456',
        id: 'user-456',
        nome: 'Dra. Maria Oliveira',
        cpf: '987.654.321-11',
        email_inst: 'maria.oliveira@instituicao.edu.br',
        status: 'Em Análise',
        lattes: 'http://lattes.cnpq.br/987654321',
        area: 'Biologia',
        titulacao: 'Mestrado',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('researchers', JSON.stringify(defaultResearchers));
  }

  if (!uid) return;

  const hasData = localStorage.getItem('fomento_pesquisa');
  if (hasData) return; // Already seeded

  const mockPesquisa = [
    {
      id: 'mock-1',
      authorUid: uid,
      titulo: 'Estudo Clínico sobre Novos Biomarcadores em Oncologia',
      status: 'Aprovado',
      area: 'Oncologia',
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    },
    {
      id: 'mock-2',
      authorUid: uid,
      titulo: 'Análise Epidemiológica da COVID-19 em Áreas Urbanas',
      status: 'Em Análise',
      area: 'Saúde Pública',
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: 'mock-5',
      authorUid: uid,
      titulo: 'Desenvolvimento de Vacinas Utilizando Tecnologia mRNA',
      status: 'Rascunho',
      area: 'Imunologia',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];

  const mockPublicacao = [
    {
      id: 'mock-3',
      authorUid: uid,
      titulo: 'Impacto da Inteligência Artificial na Triagem de Doenças Raras',
      revista: 'Nature Biotechnology',
      status: 'Pendente',
      valor_solicitado: 5000,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    }
  ];

  const mockPicite = [
    {
      id: 'mock-4',
      authorUid: uid,
      titulo_projeto: 'Monitoramento Genético de Espécies em Risco de Extinção',
      nome_estudante: 'Ana Silva Santos',
      orientador: 'Dr. Pesquisador Teste',
      status: 'Aprovado',
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    }
  ];

  localStorage.setItem('fomento_pesquisa', JSON.stringify(mockPesquisa));
  localStorage.setItem('fomento_publicacao', JSON.stringify(mockPublicacao));
  localStorage.setItem('picite', JSON.stringify(mockPicite));
};
