// Catálogo e modelos de texto usados pelo seeder (produtos, chamados e artigos).
// Tudo em português do Brasil, com vocabulário típico de lojas de eletrônicos.

// ---------------------------------------------------------------------------
// Categorias (10 raízes x 4 subcategorias = 50 categorias)
// ---------------------------------------------------------------------------
const CATALOGO = [
  {
    nome: 'Smartphones',
    subs: [
      { nome: 'Smartphones Android', tipo: 'smartphone', marcas: ['Samsung', 'Motorola', 'Xiaomi', 'Realme'], uso: 'o dia a dia, redes sociais, fotografia e trabalho em movimento',
        atributos: { Tela: ['6,1" AMOLED', '6,5" AMOLED 120 Hz', '6,7" OLED 120 Hz'], Memória: ['4 GB RAM / 64 GB', '6 GB RAM / 128 GB', '8 GB RAM / 256 GB'], Bateria: ['4.500 mAh', '5.000 mAh com carga rápida de 33 W', '5.500 mAh com carga rápida de 67 W'], Câmera: ['50 MP com estabilização óptica', 'tripla de 64 MP', 'dupla de 48 MP'] } },
      { nome: 'iPhones', tipo: 'iPhone', marcas: ['Apple'], uso: 'quem busca desempenho, câmera de alto nível e integração com o ecossistema Apple',
        atributos: { Tela: ['6,1" Super Retina XDR', '6,7" Super Retina XDR ProMotion'], Memória: ['128 GB', '256 GB', '512 GB'], Bateria: ['até 20 horas de reprodução de vídeo', 'até 26 horas de reprodução de vídeo'], Câmera: ['dupla de 12 MP', 'tripla de 48 MP'] } },
      { nome: 'Smartphones Básicos', tipo: 'celular básico', marcas: ['Multilaser', 'Positivo', 'Nokia', 'Samsung'], uso: 'ligações, mensagens, aplicativos essenciais e uso por idosos ou crianças',
        atributos: { Tela: ['5,5" HD+', '6,0" HD+'], Memória: ['2 GB RAM / 32 GB', '3 GB RAM / 64 GB'], Bateria: ['3.000 mAh', '4.000 mAh'], Câmera: ['principal de 8 MP', 'principal de 13 MP'] } },
      { nome: 'Telefones Dobráveis', tipo: 'smartphone dobrável', marcas: ['Samsung', 'Motorola', 'Xiaomi'], uso: 'multitarefa, leitura e produtividade com tela flexível',
        atributos: { Tela: ['6,7" dobrável AMOLED', '7,6" interna dobrável'], Memória: ['8 GB RAM / 256 GB', '12 GB RAM / 512 GB'], Bateria: ['3.700 mAh', '4.400 mAh'], Câmera: ['dupla de 12 MP', 'tripla de 50 MP'] } },
    ],
  },
  {
    nome: 'Notebooks e Computadores',
    subs: [
      { nome: 'Notebooks Gamer', tipo: 'notebook gamer', marcas: ['Acer', 'Asus', 'Lenovo', 'Dell'], uso: 'jogos competitivos, streaming e renderização de vídeo',
        atributos: { Processador: ['Intel Core i5 de 13ª geração', 'Intel Core i7 de 13ª geração', 'AMD Ryzen 7'], Placa: ['NVIDIA RTX 4050', 'NVIDIA RTX 4060', 'NVIDIA RTX 4070'], Memória: ['16 GB DDR5', '32 GB DDR5'], Armazenamento: ['SSD NVMe 512 GB', 'SSD NVMe 1 TB'], Tela: ['15,6" Full HD 144 Hz', '16" QHD 165 Hz'] } },
      { nome: 'Notebooks para Trabalho', tipo: 'notebook', marcas: ['Dell', 'Lenovo', 'HP', 'Samsung'], uso: 'trabalho de escritório, estudos e videoconferências',
        atributos: { Processador: ['Intel Core i3', 'Intel Core i5', 'AMD Ryzen 5'], Memória: ['8 GB DDR4', '16 GB DDR4'], Armazenamento: ['SSD 256 GB', 'SSD 512 GB'], Tela: ['14" Full HD antirreflexo', '15,6" Full HD'], Bateria: ['até 10 horas', 'até 12 horas'] } },
      { nome: 'Desktops', tipo: 'computador desktop', marcas: ['Dell', 'HP', 'Lenovo', 'Positivo'], uso: 'escritórios, laboratórios e uso doméstico com alto desempenho',
        atributos: { Processador: ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5'], Memória: ['8 GB DDR4', '16 GB DDR4', '32 GB DDR4'], Armazenamento: ['SSD 512 GB', 'SSD 1 TB'], Conectividade: ['Wi-Fi 6 e Bluetooth 5.2', 'Ethernet Gigabit e Wi-Fi 5'] } },
      { nome: 'Tablets', tipo: 'tablet', marcas: ['Samsung', 'Apple', 'Xiaomi', 'Lenovo'], uso: 'leitura, estudos, desenho digital e entretenimento',
        atributos: { Tela: ['10,4" 2K', '11" 120 Hz', '12,4" AMOLED'], Memória: ['4 GB RAM / 64 GB', '6 GB RAM / 128 GB', '8 GB RAM / 256 GB'], Bateria: ['7.040 mAh', '8.000 mAh', '10.090 mAh'], Acessórios: ['compatível com caneta stylus', 'compatível com teclado destacável'] } },
    ],
  },
  {
    nome: 'TVs e Monitores',
    subs: [
      { nome: 'Smart TVs 4K', tipo: 'Smart TV 4K', marcas: ['Samsung', 'LG', 'Sony', 'TCL'], uso: 'filmes, séries, esportes e streaming em alta resolução',
        atributos: { Tamanho: ['43"', '50"', '55"', '65"'], Painel: ['LED 4K UHD', 'QLED 4K', 'OLED 4K'], Sistema: ['Tizen', 'webOS', 'Google TV'], Áudio: ['Dolby Atmos', '20 W RMS com Dolby Audio'], Conexões: ['3 HDMI e 2 USB', '4 HDMI com eARC e 2 USB'] } },
      { nome: 'Monitores Gamer', tipo: 'monitor gamer', marcas: ['LG', 'Samsung', 'AOC', 'Dell'], uso: 'jogos de alta velocidade com baixa latência',
        atributos: { Tamanho: ['24"', '27"', '32"'], Painel: ['IPS 1 ms', 'VA curvo 1 ms', 'IPS QHD'], Taxa: ['144 Hz', '165 Hz', '240 Hz'], Sincronismo: ['AMD FreeSync Premium', 'NVIDIA G-Sync Compatible'] } },
      { nome: 'Monitores de Escritório', tipo: 'monitor', marcas: ['Dell', 'LG', 'Philips', 'Samsung'], uso: 'produtividade, planilhas, edição de texto e home office',
        atributos: { Tamanho: ['21,5"', '24"', '27"'], Painel: ['IPS Full HD', 'IPS QHD'], Ergonomia: ['ajuste de altura e rotação', 'inclinação ajustável e baixa emissão de luz azul'], Conexões: ['HDMI e DisplayPort', 'HDMI, VGA e USB-C'] } },
      { nome: 'Projetores', tipo: 'projetor', marcas: ['Epson', 'BenQ', 'XGIMI', 'Multilaser'], uso: 'home theater, apresentações e salas de aula',
        atributos: { Resolução: ['Full HD', 'HD nativo', '4K com HDR'], Brilho: ['3.000 lúmens', '3.600 lúmens', '4.500 lúmens'], Conexões: ['HDMI e USB', 'HDMI, Wi-Fi e Bluetooth'], Lâmpada: ['LED de longa duração', 'lâmpada com 6.000 horas'] } },
    ],
  },
  {
    nome: 'Áudio',
    subs: [
      { nome: 'Fones de Ouvido Bluetooth', tipo: 'fone de ouvido Bluetooth', marcas: ['JBL', 'Sony', 'Xiaomi', 'Philips'], uso: 'música, chamadas e treinos sem fio',
        atributos: { Conexão: ['Bluetooth 5.3', 'Bluetooth 5.2 multiponto'], Bateria: ['até 8 horas por carga', 'até 30 horas com estojo'], Recursos: ['cancelamento ativo de ruído', 'resistência à água IPX4', 'microfone com redução de ruído'], Driver: ['dinâmico de 10 mm', 'dinâmico de 12 mm'] } },
      { nome: 'Caixas de Som Portáteis', tipo: 'caixa de som portátil', marcas: ['JBL', 'Sony', 'Anker', 'Philco'], uso: 'festas, viagens e uso ao ar livre',
        atributos: { Potência: ['20 W RMS', '30 W RMS', '40 W RMS'], Bateria: ['até 12 horas', 'até 20 horas'], Proteção: ['IP67 à prova d\'água e poeira', 'IPX5 resistente a respingos'], Conexão: ['Bluetooth 5.1', 'Bluetooth 5.3 e entrada auxiliar'] } },
      { nome: 'Soundbars', tipo: 'soundbar', marcas: ['Samsung', 'LG', 'Sony', 'JBL'], uso: 'melhorar o som da TV em salas de estar',
        atributos: { Canais: ['2.1', '3.1', '5.1 com subwoofer sem fio'], Potência: ['120 W', '300 W', '400 W'], Formatos: ['Dolby Digital', 'Dolby Atmos e DTS:X'], Conexões: ['HDMI ARC, óptica e Bluetooth', 'HDMI eARC e Wi-Fi'] } },
      { nome: 'Microfones', tipo: 'microfone', marcas: ['HyperX', 'Razer', 'Fifine', 'Blue'], uso: 'streaming, podcasts, gravação de vocais e reuniões online',
        atributos: { Tipo: ['condensador USB', 'dinâmico XLR', 'condensador com braço articulado'], Padrão: ['cardioide', 'omnidirecional e cardioide'], Taxa: ['24 bits / 48 kHz', '24 bits / 96 kHz'], Recursos: ['botão de mudo com LED', 'saída para monitoramento sem latência'] } },
    ],
  },
  {
    nome: 'Games',
    subs: [
      { nome: 'Consoles', tipo: 'console de videogame', marcas: ['Sony', 'Microsoft', 'Nintendo'], uso: 'jogos de nova geração em casa ou portáteis',
        atributos: { Armazenamento: ['SSD 825 GB', 'SSD 1 TB', '512 GB'], Resolução: ['até 4K a 60 fps', 'até 4K a 120 fps', '1080p portátil'], Recursos: ['retrocompatibilidade', 'Ray Tracing por hardware'], Inclusos: ['1 controle sem fio', '2 controles sem fio'] } },
      { nome: 'Controles', tipo: 'controle sem fio', marcas: ['Sony', 'Microsoft', '8BitDo', 'Logitech'], uso: 'jogar em consoles, PC e celular com precisão',
        atributos: { Conexão: ['Bluetooth', 'sem fio 2,4 GHz', 'USB-C'], Bateria: ['até 12 horas', 'até 40 horas'], Recursos: ['gatilhos adaptativos', 'vibração dupla e giroscópio'], Compatibilidade: ['PC, Android e iOS', 'console e PC'] } },
      { nome: 'Teclados e Mouses Gamer', tipo: 'periférico gamer', marcas: ['Logitech', 'Redragon', 'Razer', 'HyperX'], uso: 'jogos competitivos com resposta rápida',
        atributos: { Switch: ['mecânico vermelho', 'mecânico azul', 'óptico'], Iluminação: ['RGB personalizável', 'LED branco'], Sensor: ['óptico de 16.000 DPI', 'óptico de 25.600 DPI'], Conexão: ['USB com cabo trançado', 'sem fio 2,4 GHz'] } },
      { nome: 'Headsets Gamer', tipo: 'headset gamer', marcas: ['HyperX', 'Logitech', 'Redragon', 'Razer'], uso: 'comunicação em equipe e imersão sonora em jogos',
        atributos: { Som: ['estéreo', 'surround 7.1 virtual'], Conexão: ['P2 e USB', 'sem fio 2,4 GHz'], Microfone: ['removível com cancelamento de ruído', 'flexível com LED de mudo'], Conforto: ['almofadas em espuma viscoelástica', 'arco com acabamento em couro sintético'] } },
    ],
  },
  {
    nome: 'Acessórios',
    subs: [
      { nome: 'Carregadores', tipo: 'carregador', marcas: ['Anker', 'Baseus', 'Samsung', 'Apple'], uso: 'recarga rápida e segura de smartphones, tablets e notebooks',
        atributos: { Potência: ['20 W', '33 W', '65 W GaN', '100 W GaN'], Portas: ['1 USB-C', '2 USB-C', 'USB-C e USB-A'], Proteções: ['contra sobrecarga e superaquecimento', 'contra curto-circuito e sobretensão'], Padrão: ['Power Delivery 3.0', 'Quick Charge 4+'] } },
      { nome: 'Cabos e Adaptadores', tipo: 'cabo', marcas: ['Anker', 'Baseus', 'Ugreen', 'Multilaser'], uso: 'transferência de dados, vídeo e carregamento',
        atributos: { Conector: ['USB-C para USB-C', 'USB-C para Lightning', 'HDMI 2.1', 'DisplayPort 1.4'], Comprimento: ['1 metro', '2 metros', '3 metros'], Revestimento: ['nylon trançado', 'TPE flexível'], Velocidade: ['até 480 Mbps', 'até 10 Gbps'] } },
      { nome: 'Power Banks', tipo: 'power bank', marcas: ['Anker', 'Xiaomi', 'Baseus', 'Samsung'], uso: 'recarregar dispositivos durante viagens e deslocamentos',
        atributos: { Capacidade: ['10.000 mAh', '20.000 mAh', '30.000 mAh'], Saídas: ['USB-C PD 22,5 W e USB-A', '2 USB-A e 1 USB-C'], Display: ['indicador digital de carga', 'LEDs indicadores'], Segurança: ['proteção multicamadas', 'certificado contra superaquecimento'] } },
      { nome: 'Capas e Películas', tipo: 'capa protetora', marcas: ['Spigen', 'Gshield', 'Capa Brasil', 'Baseus'], uso: 'proteger celulares e tablets contra quedas e riscos',
        atributos: { Material: ['silicone líquido', 'TPU transparente', 'policarbonato reforçado'], Proteção: ['bordas elevadas anti-impacto', 'cantos reforçados com air cushion'], Compatibilidade: ['modelos recentes da linha', 'vários modelos do fabricante'], Acabamento: ['toque aveludado', 'antiderrapante'] } },
    ],
  },
  {
    nome: 'Câmeras e Drones',
    subs: [
      { nome: 'Câmeras Digitais', tipo: 'câmera digital', marcas: ['Canon', 'Sony', 'Nikon', 'Fujifilm'], uso: 'fotografia de viagens, retratos e vídeo de alta qualidade',
        atributos: { Sensor: ['APS-C 24 MP', 'Full Frame 33 MP', 'Micro 4/3 20 MP'], Vídeo: ['4K a 30 fps', '4K a 60 fps', 'Full HD a 120 fps'], Conectividade: ['Wi-Fi e Bluetooth', 'Wi-Fi e USB-C'], Tela: ['articulada de 3"', 'touchscreen de 3,2"'] } },
      { nome: 'Câmeras de Ação', tipo: 'câmera de ação', marcas: ['GoPro', 'DJI', 'Insta360', 'SJCAM'], uso: 'esportes, aventuras e gravação em movimento',
        atributos: { Vídeo: ['5K a 30 fps', '4K a 120 fps'], Estabilização: ['eletrônica HyperSmooth', 'horizonte nivelado em 360°'], Resistência: ['à prova d\'água até 10 m', 'à prova d\'água até 18 m'], Bateria: ['até 90 minutos de gravação', 'até 2 horas de gravação'] } },
      { nome: 'Drones', tipo: 'drone', marcas: ['DJI', 'Autel', 'Potensic', 'Holy Stone'], uso: 'fotografia aérea, mapeamento e vídeos cinematográficos',
        atributos: { Câmera: ['4K com gimbal de 3 eixos', '1080p com gimbal', '5,4K'], Autonomia: ['até 30 minutos de voo', 'até 34 minutos de voo'], Alcance: ['até 6 km', 'até 10 km'], Sensores: ['detecção de obstáculos omnidirecional', 'sensores frontais e inferiores'] } },
      { nome: 'Câmeras de Segurança', tipo: 'câmera de segurança', marcas: ['Intelbras', 'Positivo Casa Inteligente', 'TP-Link', 'Xiaomi'], uso: 'monitorar casas, lojas e escritórios em tempo real',
        atributos: { Resolução: ['Full HD 1080p', '2K', '4K'], Visão: ['noturna de até 10 m', 'noturna colorida'], Recursos: ['detecção de movimento e alertas no app', 'áudio bidirecional'], Armazenamento: ['cartão microSD de até 256 GB', 'nuvem e cartão microSD'] } },
    ],
  },
  {
    nome: 'Casa Inteligente',
    subs: [
      { nome: 'Assistentes Virtuais', tipo: 'assistente virtual', marcas: ['Amazon', 'Google', 'Apple', 'Xiaomi'], uso: 'controlar a casa por voz e responder perguntas do dia a dia',
        atributos: { Assistente: ['Alexa', 'Google Assistente', 'Siri'], Áudio: ['alto-falante de 360°', 'alto-falante de 3"'], Conectividade: ['Wi-Fi e Bluetooth', 'Wi-Fi, Bluetooth e Zigbee'], Recursos: ['microfones com redução de ruído', 'controle de dispositivos compatíveis'] } },
      { nome: 'Lâmpadas e Iluminação', tipo: 'lâmpada inteligente', marcas: ['Philips Hue', 'Positivo Casa Inteligente', 'Xiaomi', 'Intelbras'], uso: 'automatizar a iluminação, criar cenas e economizar energia',
        atributos: { Cor: ['RGB 16 milhões de cores', 'branco ajustável', 'branco quente'], Potência: ['9 W equivalente a 60 W', '12 W equivalente a 75 W'], Conexão: ['Wi-Fi 2,4 GHz', 'Zigbee com ponte'], Controle: ['aplicativo e comando de voz', 'agendamentos e temporizador'] } },
      { nome: 'Fechaduras Digitais', tipo: 'fechadura digital', marcas: ['Intelbras', 'Yale', 'Samsung', 'Philips'], uso: 'acesso sem chave por senha, biometria ou aplicativo',
        atributos: { Acesso: ['senha e biometria', 'senha, cartão e chave mecânica', 'biometria, senha e aplicativo'], Alimentação: ['4 pilhas AA', 'bateria recarregável'], Segurança: ['alarme contra arrombamento', 'bloqueio após tentativas inválidas'], Instalação: ['portas de madeira', 'portas de madeira e metal'] } },
      { nome: 'Tomadas e Sensores', tipo: 'sensor inteligente', marcas: ['Intelbras', 'Positivo Casa Inteligente', 'TP-Link', 'Xiaomi'], uso: 'automação residencial, economia de energia e alertas',
        atributos: { Tipo: ['tomada inteligente com medição de consumo', 'sensor de presença', 'sensor de abertura de porta e janela'], Conexão: ['Wi-Fi 2,4 GHz', 'Zigbee 3.0'], Recursos: ['rotinas e automações no aplicativo', 'notificações em tempo real'], Alimentação: ['bivolt automática', 'bateria CR2032'] } },
    ],
  },
  {
    nome: 'Redes e Conectividade',
    subs: [
      { nome: 'Roteadores Wi-Fi', tipo: 'roteador Wi-Fi', marcas: ['TP-Link', 'Intelbras', 'Asus', 'D-Link'], uso: 'cobertura de internet estável em casas e escritórios',
        atributos: { Padrão: ['Wi-Fi 5 AC1200', 'Wi-Fi 6 AX1800', 'Wi-Fi 6 AX3000'], Antenas: ['4 antenas externas', '6 antenas de alto ganho'], Portas: ['4 LAN Gigabit', '1 WAN e 4 LAN Gigabit'], Recursos: ['controle parental', 'Beamforming e MU-MIMO'] } },
      { nome: 'Repetidores e Mesh', tipo: 'sistema Wi-Fi mesh', marcas: ['TP-Link', 'Intelbras', 'Xiaomi', 'Netgear'], uso: 'eliminar zonas sem sinal em residências grandes',
        atributos: { Padrão: ['Wi-Fi 5 AC1200', 'Wi-Fi 6 AX1800'], Cobertura: ['até 200 m²', 'até 400 m²'], Unidades: ['pacote com 2 unidades', 'pacote com 3 unidades'], Recursos: ['roaming sem interrupção', 'gerenciamento pelo aplicativo'] } },
      { nome: 'Switches e Cabos de Rede', tipo: 'switch de rede', marcas: ['TP-Link', 'Intelbras', 'D-Link', 'Ubiquiti'], uso: 'ampliar pontos de rede cabeados com estabilidade',
        atributos: { Portas: ['5 portas Gigabit', '8 portas Gigabit', '16 portas Gigabit'], Gerenciamento: ['não gerenciável', 'gerenciável web smart'], Alimentação: ['bivolt automática', 'PoE+ com 4 portas'], Carcaça: ['metálica', 'plástica compacta'] } },
      { nome: 'Modems e Antenas', tipo: 'adaptador de rede', marcas: ['TP-Link', 'Intelbras', 'Multilaser', 'Asus'], uso: 'melhorar a conexão de computadores e dispositivos',
        atributos: { Padrão: ['Wi-Fi 5 USB', 'Wi-Fi 6 USB', 'Wi-Fi 6E PCIe'], Velocidade: ['até 650 Mbps', 'até 1.300 Mbps', 'até 2.400 Mbps'], Bluetooth: ['Bluetooth 5.0 integrado', 'sem Bluetooth'], Instalação: ['plug and play', 'driver incluso'] } },
    ],
  },
  {
    nome: 'Wearables',
    subs: [
      { nome: 'Smartwatches', tipo: 'smartwatch', marcas: ['Apple', 'Samsung', 'Xiaomi', 'Garmin'], uso: 'acompanhar saúde, notificações e treinos no pulso',
        atributos: { Tela: ['AMOLED 1,4"', 'AMOLED 1,5" sempre ativa', 'LTPO OLED'], Bateria: ['até 2 dias', 'até 7 dias', 'até 14 dias'], Sensores: ['frequência cardíaca e oxímetro', 'ECG, temperatura e GPS'], Resistência: ['5 ATM', 'IP68 e 5 ATM'] } },
      { nome: 'Pulseiras Inteligentes', tipo: 'pulseira inteligente', marcas: ['Xiaomi', 'Huawei', 'Samsung', 'Amazfit'], uso: 'monitoramento de atividades físicas e sono',
        atributos: { Tela: ['AMOLED 1,1"', 'AMOLED 1,62"'], Bateria: ['até 14 dias', 'até 21 dias'], Monitoramento: ['passos, sono e frequência cardíaca', 'mais de 100 modos esportivos'], Resistência: ['5 ATM', 'à prova d\'água para natação'] } },
      { nome: 'Óculos e Fones Inteligentes', tipo: 'óculos inteligente', marcas: ['Ray-Ban Meta', 'Xiaomi', 'Huawei', 'Lenovo'], uso: 'ouvir áudio, atender chamadas e capturar fotos sem as mãos',
        atributos: { Áudio: ['alto-falantes direcionais', 'condução aberta'], Câmera: ['12 MP com vídeo Full HD', 'sem câmera'], Bateria: ['até 4 horas de uso', 'até 6 horas com estojo'], Lentes: ['com proteção UV', 'fotossensíveis'] } },
      { nome: 'Rastreadores', tipo: 'rastreador', marcas: ['Apple', 'Samsung', 'Tile', 'Garmin'], uso: 'localizar chaves, mochilas, veículos e pets',
        atributos: { Tecnologia: ['Bluetooth e rede colaborativa', 'Ultra Wideband', 'GPS com chip 4G'], Bateria: ['pilha CR2032 substituível', 'bateria recarregável'], Alcance: ['até 120 m', 'localização global'], Recursos: ['alerta sonoro', 'modo perdido'] } },
    ],
  },
];

// ---------------------------------------------------------------------------
// Fragmentos de descrição de produtos
// ---------------------------------------------------------------------------
const PRODUTO_ABERTURAS = [
  'Desenvolvido para entregar desempenho consistente, o {nome} combina acabamento premium com tecnologia de ponta.',
  'O {nome} foi projetado para quem exige confiabilidade e praticidade no uso diário.',
  'Com design moderno e recursos avançados, o {nome} é uma ótima escolha para {uso}.',
  'Equilíbrio entre custo e benefício: o {nome} oferece tudo o que você precisa em um único produto.',
  'Fabricado com materiais de alta qualidade, o {nome} garante durabilidade mesmo em uso intenso.',
];
const PRODUTO_QUALIDADE = [
  'Passou por rigorosos testes de qualidade e conta com certificação da Anatel, garantindo segurança e compatibilidade com a rede elétrica brasileira.',
  'Seu projeto prioriza a eficiência energética, reduzindo o consumo sem abrir mão do desempenho.',
  'A construção reforçada protege os componentes internos contra impactos leves, poeira e variações de temperatura.',
  'O produto é compatível com os principais sistemas e aplicativos do mercado, facilitando a configuração inicial em poucos minutos.',
  'Atualizações de software e firmware podem ser instaladas diretamente pelo aplicativo oficial do fabricante.',
];
const PRODUTO_INCLUSOS = [
  'Acompanha na caixa: manual de instruções em português, cabo de alimentação ou carregamento, termo de garantia e nota fiscal.',
  'Itens inclusos: produto, cabo USB-C, guia rápido de instalação e certificado de garantia do fabricante.',
  'Conteúdo da embalagem: unidade principal, acessórios essenciais, documentação técnica e termo de garantia.',
];
const PRODUTO_GARANTIA = [
  'Garantia de 12 meses contra defeitos de fabricação, sendo 90 dias legais e 9 meses adicionais oferecidos pelo fabricante.',
  'Cobertura de 12 meses diretamente com a assistência técnica autorizada, mediante apresentação da nota fiscal.',
  'Garantia de 24 meses para defeitos de fabricação, incluindo suporte técnico por telefone e chat.',
];
const PRODUTO_USO = [
  'Recomendado para {uso}.',
  'Ideal para quem busca praticidade em {uso}.',
  'Uma opção versátil para {uso}, atendendo desde usuários iniciantes até os mais exigentes.',
];

// ---------------------------------------------------------------------------
// Chamados de suporte
// ---------------------------------------------------------------------------
// Cada problema tem títulos e sintomas. {produto} é substituído pelo nome do produto.
const PROBLEMAS = [
  {
    chave: 'nao-liga',
    titulos: ['{produto} não liga mais', 'Aparelho não liga nem com o carregador conectado', 'Produto parou de ligar do nada', 'Tela preta e nenhum sinal de vida no {produto}', 'Meu {produto} não dá sinal de energia'],
    sintomas: [
      'Ontem ele estava funcionando normalmente e hoje, ao pressionar o botão de ligar, nada acontece: nenhuma luz, nenhum som e nenhuma vibração.',
      'O aparelho simplesmente morreu. Segurei o botão de energia por mais de 30 segundos e a tela continua totalmente apagada.',
      'Depois de uma queda de energia na minha casa, o produto nunca mais ligou. O LED indicador também não acende.',
      'Ele chega a mostrar o logotipo do fabricante por alguns segundos, mas desliga logo em seguida e entra em um ciclo de reinicializações.',
    ],
  },
  {
    chave: 'bateria',
    titulos: ['Bateria do {produto} descarrega muito rápido', 'Não carrega a bateria mesmo conectado na tomada', 'O {produto} não carrega a bateria', 'Carregador não carrega o aparelho', 'Bateria estufada ou com autonomia muito baixa', 'Aparelho só funciona ligado na tomada'],
    sintomas: [
      'A bateria que durava um dia inteiro agora não chega a três horas de uso, mesmo com o brilho baixo e sem aplicativos pesados abertos.',
      'Ao conectar o carregador original, o ícone de carregamento aparece por um instante e some. A porcentagem não sobe, ficando travada em 12%.',
      'Percebi que a parte traseira está levemente abaulada, o que parece indicar bateria inchada. Parei de usar por segurança.',
      'O produto só mantém o funcionamento enquanto está ligado diretamente à energia. Quando desconecto o cabo, ele desliga na hora.',
      'O cabo e a fonte esquentam bastante, mas a carga não avança. Já testei em duas tomadas diferentes da casa.',
    ],
  },
  {
    chave: 'tela',
    titulos: ['Tela do {produto} com listras verticais', 'Imagem piscando e com manchas no {produto}', 'Display trincado após pequena queda', 'Touch não responde direito', 'Tela com pixels mortos e manchas escuras'],
    sintomas: [
      'Apareceram listras verticais coloridas no centro da tela que aumentam com o passar das horas de uso.',
      'A imagem fica piscando de forma intermitente e, às vezes, desaparece completamente por alguns segundos antes de voltar.',
      'Uma pequena queda de uma altura baixa trincou o canto do vidro e agora o touch deixou de funcionar naquela região.',
      'Uma mancha escura cresce no canto inferior do display, e parte da tela fica com a cor mais amarelada que o restante.',
    ],
  },
  {
    chave: 'garantia',
    titulos: ['Dúvida sobre garantia do {produto}', 'Como acionar a garantia de fabricante?', 'Garantia negada pela assistência técnica', 'Preciso de comprovante para ativar garantia estendida', 'Prazo da garantia ainda está valendo?'],
    sintomas: [
      'Comprei o produto há alguns meses e apresentou defeito. Gostaria de saber qual é o procedimento para acionar a garantia e em quais assistências posso levar.',
      'A assistência técnica autorizada negou o conserto alegando mau uso, mas não encontrei nenhuma marca de queda ou contato com líquidos.',
      'Perdi a nota fiscal impressa. Existe como baixar uma segunda via para comprovar a data da compra e a cobertura da garantia?',
      'Gostaria de entender se o defeito apresentado está coberto pela garantia legal de 90 dias ou pela garantia adicional do fabricante.',
    ],
  },
  {
    chave: 'troca',
    titulos: ['Quero trocar o {produto} por defeito', 'Solicitação de devolução dentro de 7 dias', 'Produto chegou diferente do anunciado', 'Pedido de troca por outro modelo', 'Arrependimento da compra e reembolso'],
    sintomas: [
      'Recebi o produto ontem e ele apresenta defeito logo na primeira utilização. Gostaria de trocar por uma unidade nova ou receber o valor de volta.',
      'A cor e a especificação do produto que chegou não correspondem ao que estava descrito no anúncio. Quero devolver e receber o reembolso.',
      'Estou dentro do prazo de arrependimento de 7 dias e gostaria de devolver o item na embalagem original, sem uso.',
      'Preciso trocar por um modelo com mais capacidade. Existe diferença de valor a pagar e como funciona o envio do item de volta?',
    ],
  },
  {
    chave: 'conectividade',
    titulos: ['Wi-Fi do {produto} cai toda hora', 'Bluetooth não pareia com o celular', 'Não consigo conectar o {produto} na rede', 'Conexão instável e lentidão', 'Dispositivo não é reconhecido pelo computador'],
    sintomas: [
      'A conexão com a rede Wi-Fi cai a cada poucos minutos e só volta depois de reiniciar o roteador, mesmo estando perto do ponto de acesso.',
      'Tento fazer o pareamento por Bluetooth, mas o dispositivo aparece na lista e retorna erro de conexão logo depois.',
      'Ao ligar o produto na porta USB do computador, o sistema não o reconhece e exibe a mensagem de dispositivo desconhecido.',
      'A velocidade da internet no aparelho é muito inferior à dos outros dispositivos da casa, e a conexão fica instável à noite.',
    ],
  },
  {
    chave: 'superaquecimento',
    titulos: ['{produto} esquentando demais', 'Aparelho desliga sozinho por superaquecimento', 'Cheiro de queimado saindo do equipamento', 'Ventoinha muito barulhenta e temperatura alta'],
    sintomas: [
      'Depois de poucos minutos de uso o aparelho fica extremamente quente ao toque e, em seguida, desliga sozinho para se proteger.',
      'Sinto um cheiro de queimado vindo da parte traseira e parei de utilizar imediatamente por medo de acontecer algum acidente.',
      'A ventoinha gira em velocidade máxima o tempo todo, fazendo muito barulho, e mesmo assim a temperatura continua subindo.',
    ],
  },
  {
    chave: 'audio',
    titulos: ['Som chiando e com ruídos no {produto}', 'Áudio só sai em um lado', 'Microfone não funciona nas chamadas', 'Volume baixo mesmo no máximo'],
    sintomas: [
      'O áudio sai com chiado e estalos constantes, principalmente em volumes mais altos, prejudicando a qualidade da música.',
      'Apenas o lado esquerdo emite som. Testei em outros aparelhos e o problema persiste, então não parece ser do celular.',
      'As pessoas dizem que não me escutam durante as ligações e reuniões online, apesar de o microfone aparecer como ativo.',
    ],
  },
  {
    chave: 'software',
    titulos: ['Aparelho travando após atualização', 'Erro ao atualizar o firmware do {produto}', 'Aplicativo oficial não abre', 'Preciso restaurar para o padrão de fábrica', 'Sistema reiniciando sozinho'],
    sintomas: [
      'Depois da última atualização de software, o aparelho ficou extremamente lento e trava ao abrir qualquer aplicativo.',
      'A atualização de firmware fica parada em 47% e depois exibe mensagem de erro sem concluir. Receio que o produto fique inutilizado.',
      'O aplicativo oficial fecha sozinho logo após abrir, impossibilitando a configuração e o uso de recursos importantes.',
      'O sistema reinicia sozinho várias vezes ao dia e, às vezes, fica preso na tela de inicialização por muito tempo.',
    ],
  },
  {
    chave: 'conta',
    titulos: ['Não consigo acessar minha conta', 'Esqueci a senha e não recebo o e-mail de redefinição', 'Conta bloqueada após várias tentativas', 'Como alterar o e-mail cadastrado?', 'Perdi o acesso à minha conta da loja'],
    sintomas: [
      'Esqueci a senha da minha conta e, ao pedir a redefinição, o e-mail nunca chega, nem na caixa de spam.',
      'Minha conta foi bloqueada após tentativas inválidas de login. Preciso recuperar o acesso para acompanhar meus pedidos e garantias.',
      'Troquei de endereço de e-mail e não consigo mais entrar na minha conta porque o código de verificação é enviado ao e-mail antigo.',
    ],
  },
  {
    chave: 'entrega',
    titulos: ['Pedido atrasado e sem atualização de rastreio', 'Produto entregue danificado', 'Nota fiscal não chegou com o pedido', 'Entrega em endereço errado', 'Cobrança duplicada no cartão'],
    sintomas: [
      'O prazo de entrega informado já passou há vários dias e o código de rastreio não registra nenhuma movimentação desde o último centro de distribuição.',
      'A caixa chegou amassada e com a fita violada. Ao abrir, o produto estava com a carcaça rachada e peças soltas.',
      'Recebi o pedido, mas não veio nenhuma nota fiscal na embalagem e nem no e-mail. Preciso do documento para a garantia.',
      'Fui cobrado duas vezes no cartão de crédito pelo mesmo pedido e gostaria de solicitar o estorno da cobrança duplicada.',
    ],
  },
];

const CHAMADO_ABERTURAS = [
  'Olá, boa tarde.', 'Bom dia, equipe de suporte.', 'Prezados,', 'Olá! Preciso de ajuda urgente.', 'Boa noite.', 'Oi, tudo bem?',
];
const CHAMADO_CONTEXTO = [
  'Comprei o produto há aproximadamente {meses} meses pelo site da loja e sempre utilizei conforme as orientações do manual.',
  'O aparelho está comigo há {meses} meses e nunca havia apresentado nenhum tipo de problema até agora.',
  'Adquiri o item como presente para a família e já utilizamos por cerca de {meses} meses sem qualquer intercorrência.',
  'Uso o produto diariamente para trabalho e estudo desde que o adquiri, há uns {meses} meses.',
];
const CHAMADO_TENTATIVAS = [
  'Já tentei reiniciar o equipamento, trocar o cabo e testar em outra tomada, mas nada resolveu.',
  'Segui o passo a passo do manual e também as dicas do site do fabricante, sem sucesso.',
  'Tentei restaurar as configurações de fábrica e atualizar para a versão mais recente, mas o problema continua.',
  'Testei com outro carregador e outro cabo emprestados de um amigo e o comportamento foi exatamente o mesmo.',
  'Deixei o aparelho desligado durante a noite toda para ver se melhorava, mas o defeito permaneceu pela manhã.',
];
const CHAMADO_FECHOS = [
  'Gostaria de saber quais são os próximos passos e se há necessidade de enviar o produto para análise.',
  'Aguardo um retorno o quanto antes, pois utilizo o produto no meu dia a dia e estou muito prejudicado.',
  'Posso enviar fotos e vídeos do problema, se necessário. Agradeço desde já a atenção.',
  'Peço, por favor, que informem o prazo para solução e se existe a possibilidade de troca por uma unidade nova.',
  'Fico no aguardo e agradeço a atenção. Tenho a nota fiscal e a embalagem original comigo.',
];

// ---------------------------------------------------------------------------
// Artigos da Base de Conhecimento (20 tópicos x 50 subcategorias = 1.000)
// {tipo} é substituído pelo tipo de produto da subcategoria.
// ---------------------------------------------------------------------------
const TOPICOS_ARTIGO = [
  {
    titulo: 'Como recuperar o acesso à sua conta ao configurar o {tipo}',
    paragrafos: [
      'Se você não consegue mais entrar na sua conta, é possível recuperar o acesso em poucos minutos. Na tela de login, toque em "Não consigo entrar" e informe o e-mail cadastrado na compra do seu {tipo}.',
      'Você receberá um link para redefinir a senha. Caso o e-mail não chegue, verifique a caixa de spam e confirme se o endereço digitado está correto. O link expira em 30 minutos por segurança.',
      'Se você não tem mais acesso ao e-mail cadastrado, entre em contato com nosso suporte com a nota fiscal e um documento com foto para validarmos sua identidade e atualizarmos seus dados.',
    ],
  },
  {
    titulo: 'O {tipo} não carrega a bateria: causas e soluções',
    paragrafos: [
      'Quando a bateria do {tipo} não carrega, a causa mais comum é o desgaste do cabo ou da fonte. Teste com outro cabo certificado e conecte diretamente à tomada, evitando extensões e filtros de linha.',
      'Verifique se a entrada de carregamento está livre de poeira e sujeira. Use um palito de madeira ou escova macia para limpar com cuidado, sempre com o aparelho desligado.',
      'Se mesmo assim o carregamento não avançar, a bateria pode estar degradada. Procure uma assistência autorizada e nunca utilize um equipamento com bateria estufada.',
    ],
  },
  {
    titulo: 'Passo a passo quando o {tipo} não liga',
    paragrafos: [
      'Antes de levar o {tipo} à assistência, conecte-o à energia por pelo menos 30 minutos. Baterias totalmente descarregadas podem demorar a responder.',
      'Em seguida, mantenha o botão de ligar pressionado por 30 segundos para forçar uma reinicialização. Se houver LED indicador, observe se ele acende ou pisca.',
      'Caso nenhum sinal seja exibido, desconecte acessórios, teste outra tomada e outro cabo. Persistindo o problema, abra um chamado informando os testes realizados.',
    ],
  },
  {
    titulo: 'Problemas de imagem e tela em {tipo}: como diagnosticar',
    paragrafos: [
      'Listras, manchas e piscadas na tela de um {tipo} podem indicar falha de software ou de hardware. Comece reiniciando o equipamento e atualizando para a versão mais recente do sistema.',
      'Conecte o produto a outra fonte de vídeo ou teste com outro cabo para descartar falhas externas. Se a imagem do menu de configuração também apresentar defeitos, o painel pode estar danificado.',
      'Danos físicos como trincas e impactos geralmente não são cobertos pela garantia de fabricante. Consulte o termo de garantia para mais detalhes.',
    ],
  },
  {
    titulo: 'Garantia do {tipo}: prazos, coberturas e como acionar',
    paragrafos: [
      'Todo {tipo} vendido pela nossa loja conta com garantia legal de 90 dias e garantia adicional do fabricante, totalizando em geral 12 meses a partir da data da nota fiscal.',
      'A garantia cobre defeitos de fabricação. Não estão cobertos danos por queda, contato com líquidos, uso de acessórios não originais ou reparos realizados por terceiros não autorizados.',
      'Para acionar, abra um chamado com número do pedido, descrição do defeito e fotos ou vídeos. Nossa equipe indicará a assistência técnica autorizada mais próxima.',
    ],
  },
  {
    titulo: 'Troca e devolução de {tipo}: regras e prazos',
    paragrafos: [
      'Você pode devolver o {tipo} em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor, sem precisar justificar o motivo da desistência.',
      'O produto deve estar na embalagem original, com acessórios, manuais e nota fiscal. O reembolso é feito na mesma forma de pagamento em até 10 dias úteis após a análise.',
      'Para troca por defeito, abra um chamado no prazo legal. Após a análise técnica, enviaremos uma unidade nova ou realizaremos o estorno.',
    ],
  },
  {
    titulo: 'Atualização de firmware do {tipo} sem riscos',
    paragrafos: [
      'Manter o firmware do {tipo} atualizado corrige falhas, melhora a estabilidade e adiciona recursos. Antes de iniciar, certifique-se de que o aparelho está com mais de 50% de bateria.',
      'Utilize sempre o aplicativo ou o site oficial do fabricante e mantenha o dispositivo conectado a uma rede Wi-Fi estável durante todo o processo.',
      'Nunca desligue o equipamento durante a atualização. Se o processo travar, aguarde 15 minutos e reinicie o aparelho antes de tentar novamente.',
    ],
  },
  {
    titulo: 'Wi-Fi caindo no {tipo}: como estabilizar a conexão',
    paragrafos: [
      'Quedas de Wi-Fi em um {tipo} geralmente estão ligadas à distância do roteador, interferência de outros aparelhos ou canal de transmissão congestionado.',
      'Aproxime o aparelho do roteador, evite obstáculos e utilize a rede de 5 GHz quando disponível. Alterar o canal do roteador para um menos congestionado também ajuda.',
      'Se o problema persistir, esqueça a rede nas configurações, reconecte inserindo a senha novamente e reinicie o roteador desligando-o da tomada por 30 segundos.',
    ],
  },
  {
    titulo: 'Como parear o {tipo} por Bluetooth',
    paragrafos: [
      'Para parear o {tipo}, ative o modo de pareamento mantendo o botão correspondente pressionado até o LED piscar rapidamente. Em seguida, abra o Bluetooth do celular ou computador.',
      'Selecione o nome do dispositivo na lista. Caso a conexão falhe, remova pareamentos anteriores nas configurações de Bluetooth e tente novamente.',
      'Mantenha os aparelhos a menos de 2 metros durante o processo e desligue outros dispositivos que possam interferir no sinal.',
    ],
  },
  {
    titulo: 'Superaquecimento em {tipo}: o que fazer',
    paragrafos: [
      'Um {tipo} pode esquentar durante o uso intenso, o que é normal até certo ponto. Temperaturas muito altas, desligamentos repentinos ou cheiro de queimado exigem atenção imediata.',
      'Desligue o aparelho, retire-o da tomada e deixe esfriar em local ventilado. Evite uso sob luz solar direta e mantenha as aberturas de ventilação desobstruídas.',
      'Se o aquecimento persistir ou houver cheiro de queimado, suspenda o uso e abra um chamado. Nunca tente abrir o equipamento por conta própria.',
    ],
  },
  {
    titulo: 'Limpeza e conservação do {tipo}',
    paragrafos: [
      'A limpeza correta prolonga a vida útil do {tipo}. Desligue e desconecte o aparelho antes de limpar e use um pano macio levemente umedecido com água.',
      'Evite álcool em excesso, produtos abrasivos ou jatos diretos de líquidos. Para entradas e saídas de ar, utilize um pincel macio ou ar comprimido a uma distância segura.',
      'Guarde o equipamento em local seco, longe de calor excessivo e umidade, preferencialmente na embalagem original quando ficar muito tempo sem uso.',
    ],
  },
  {
    titulo: 'Problemas de áudio no {tipo}: chiados, ruídos e volume baixo',
    paragrafos: [
      'Chiados e ruídos em um {tipo} podem ter origem em cabos defeituosos, interferências ou configurações de equalização. Teste outro cabo e outra fonte de áudio para isolar o problema.',
      'Verifique se o volume do dispositivo de origem e do próprio {tipo} estão em níveis adequados e se não há ativação de modos de economia de energia.',
      'Caso o som continue distorcido em todos os testes, o alto-falante ou o driver pode estar danificado e o produto deve ser encaminhado para análise técnica.',
    ],
  },
  {
    titulo: 'Configuração inicial do {tipo}: guia rápido',
    paragrafos: [
      'Ao receber o {tipo}, retire as películas protetoras, conecte-o à energia e siga as instruções que aparecem na tela ou no aplicativo do fabricante.',
      'Crie ou acesse sua conta oficial, conecte à rede Wi-Fi e instale as atualizações disponíveis antes de começar a usar. Isso garante estabilidade e acesso aos recursos mais recentes.',
      'Guarde a nota fiscal e a embalagem original por todo o período de garantia. Você encontrará o número de série em uma etiqueta no produto ou nas configurações do sistema.',
    ],
  },
  {
    titulo: 'Como solicitar nota fiscal e comprovantes do {tipo}',
    paragrafos: [
      'A nota fiscal eletrônica da compra do seu {tipo} é enviada por e-mail após a aprovação do pagamento e também fica disponível na área "Meus Pedidos" do site.',
      'Caso não tenha recebido, verifique a caixa de spam e confirme o e-mail cadastrado. Você pode baixar a segunda via em formato PDF a qualquer momento.',
      'Para empresas, é possível solicitar a emissão com CNPJ antes da finalização da compra. Depois de emitida, a nota fiscal não pode ser alterada.',
    ],
  },
  {
    titulo: 'Rastreio de pedido e atrasos na entrega do {tipo}',
    paragrafos: [
      'Após o envio do seu {tipo}, você receberá um código de rastreio por e-mail. Os eventos podem levar até 24 horas para aparecer no site da transportadora.',
      'Se o prazo prometido foi ultrapassado, abra um chamado informando o número do pedido e o código de rastreio. Vamos acionar a transportadora e informar uma nova previsão.',
      'Ao receber a mercadoria com avaria na embalagem, recuse a entrega ou registre fotos e abra um chamado em até 48 horas.',
    ],
  },
  {
    titulo: 'Restaurar o {tipo} para o padrão de fábrica',
    paragrafos: [
      'Restaurar o {tipo} para o padrão de fábrica resolve lentidão, travamentos e erros persistentes de configuração. Atenção: todos os dados e ajustes personalizados serão apagados.',
      'Faça backup das informações importantes e, em seguida, acesse o menu de configurações e procure por "Restaurar padrão de fábrica" ou "Reset". Em alguns modelos é necessário usar uma combinação de botões.',
      'Mantenha o aparelho conectado à energia durante o processo e aguarde a reinicialização completa, que pode levar até 15 minutos.',
    ],
  },
  {
    titulo: 'Acessórios compatíveis com o {tipo}',
    paragrafos: [
      'Utilizar acessórios compatíveis garante segurança e desempenho do {tipo}. Prefira itens originais ou certificados pelo fabricante, que atendem às normas da Anatel.',
      'Carregadores, cabos e adaptadores de baixa qualidade podem causar superaquecimento, lentidão no carregamento e, em casos graves, danos permanentes ao equipamento.',
      'Consulte a página do produto ou o manual para verificar a lista de acessórios compatíveis e as especificações de potência recomendadas.',
    ],
  },
  {
    titulo: 'Ruídos estranhos e vibração no {tipo}',
    paragrafos: [
      'Ruídos como estalos, zumbidos ou vibrações em um {tipo} podem indicar peças soltas, desgaste de componentes ou acúmulo de poeira em ventoinhas e alto-falantes.',
      'Coloque o aparelho em uma superfície plana e estável e verifique se algum acessório está tocando em partes móveis. Limpe as entradas de ar com um pincel macio.',
      'Se o ruído continuar, não force o funcionamento do equipamento e procure a assistência técnica para evitar danos maiores.',
    ],
  },
  {
    titulo: 'Segurança e uso responsável do {tipo}',
    paragrafos: [
      'Para usar o {tipo} com segurança, mantenha-o longe de líquidos, calor excessivo e do alcance de crianças pequenas. Utilize somente a tensão elétrica indicada no manual.',
      'Evite deixar o equipamento carregando durante a noite sobre superfícies macias, como camas e sofás, que impedem a dissipação de calor.',
      'Em caso de fumaça, cheiro de queimado ou deformação do produto, desconecte imediatamente da energia e entre em contato com o suporte.',
    ],
  },
  {
    titulo: 'Compatibilidade e requisitos de uso do {tipo}',
    paragrafos: [
      'Antes de comprar ou configurar seu {tipo}, confira os requisitos de sistema e a compatibilidade com outros dispositivos descritos na página do produto.',
      'Alguns recursos exigem aplicativo oficial, versão mínima do sistema operacional ou conexão com a internet. A ausência desses requisitos pode limitar funcionalidades.',
      'Em caso de dúvida, nossa equipe de suporte pode confirmar a compatibilidade informando o modelo do seu aparelho e a versão do sistema.',
    ],
  },
];

module.exports = {
  CATALOGO,
  PRODUTO_ABERTURAS,
  PRODUTO_QUALIDADE,
  PRODUTO_INCLUSOS,
  PRODUTO_GARANTIA,
  PRODUTO_USO,
  PROBLEMAS,
  CHAMADO_ABERTURAS,
  CHAMADO_CONTEXTO,
  CHAMADO_TENTATIVAS,
  CHAMADO_FECHOS,
  TOPICOS_ARTIGO,
};
