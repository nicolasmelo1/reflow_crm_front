const planilha1 = {
    name : 'Vendas',
    tabelas : {
        t1 : {
            default : 'kanban',
            name : 'Pipeline',
            content :['Prospecção', 'Negociação', 'Fechado', 'Perdido'],
            cards : [[{titulo:"Cliente 1", subtitulo:"Comercial 1", valor: "200000", foot:"Alta"}, 
            {titulo:"Cliente 2", subtitulo:"Comercial 4", valor: "9500", foot:"Alta"}, 
            {titulo:"Cliente 3", subtitulo:"Comercial 2", valor: "13000", foot:"Baixa"}, 
            {titulo:"Cliente 4", subtitulo:"Comercial 1", valor: "22000", foot:"Média"}, 
            {titulo:"Cliente 5", subtitulo:"Comercial 1", valor: "21000", foot:"Alta"}, 
            {titulo:"Cliente 6", subtitulo:"Comercial 1", valor: "19780", foot:"Alta"}, 
            {titulo:"Cliente 7", subtitulo:"Comercial 1", valor: "20000", foot:"Alta"}],[
                {titulo:"Cliente 8", subtitulo:"Comercial 3", valor: "58000", foot:"Alta"}, 
                {titulo:"Cliente 9", subtitulo:"Comercial 3", valor: "1400", foot:"Baixa"}, 
                {titulo:"Cliente 10", subtitulo:"Comercial 3", valor: "2200", foot:"Média"}],[
                    {titulo:"Cliente 11", subtitulo:"Comercial 4", valor: "20000", foot:"Confirmado"}, 
                    {titulo:"Cliente 12", subtitulo:"Comercial 4", valor: "4050", foot:"Confirmado"}, 
                    {titulo:"Cliente 13", subtitulo:"Comercial 4", valor: "5000", foot:"Confirmado"},
                    {titulo:"Cliente 14", subtitulo:"Comercial 4", valor: "480", foot:"Confirmado"}, 
                    {titulo:"Cliente 15", subtitulo:"Comercial 1", valor: "6300", foot:"Confirmado"}],[
                        {titulo:"Cliente 16", subtitulo:"Comercial 1", valor: "2000000", foot:"Nulo"} 
                    ]],
                    tableheader: ["Nome Comercial","Valor", "Expectativa",	"Data de Atualização", "Data de Inclusão", "Anexo",	"Historico", "Status", "Produto"],
                    table:[["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
                    ]    
        },
        t2 : {
            default: 'listagem',
            name : 'Clientes',
            content :['Pessoal', 'Empresarial', 'Acadêmico'], 
            tableheader: ["Nome Comercial","Valor", "Expectativa",	"Data de Atualização", "Data de Inclusão", "Anexo",	"Historico", "Status", "Produto"],
            table:[["Comercial 1", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ["Comercial 5", "20000", "Alta", "20/08/2019", "Porposta.pdf", "Cliente pediu bla lba bla bla bla", "Negociação", "Transporte"],
            ]   
            
        }
    }
};

export default planilha1;