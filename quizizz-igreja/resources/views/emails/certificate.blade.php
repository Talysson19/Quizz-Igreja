<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <style>
        /* Ajuste crucial para PDF em modo Paisagem */
        @page {
            size: A4 landscape;
            margin: 1cm; /* Margem pequena e segura para a maioria das impressoras */
        }

        body {
            font-family: 'Georgia', serif;
            background-color: #fff;
            margin: 0;
            padding: 0;
            color: #1a1a1a;
        }

        .certificate-container {
            /* AJUSTE: Borda mais fina e elegante */
            border: 8px double #d4af37;

            /* AJUSTE: Padding interno reduzido para ganhar espaço */
            padding: 25px;

            /* Garante que o contêiner ocupe a altura total disponível na página */
            height: calc(100% - 66px); /* 100% da altura da página menos padding e borda */
            text-align: center;
            position: relative;
            box-sizing: border-box; /* Garante que padding e borda não aumentem o tamanho total */
        }

        .header {
            margin-bottom: 20px;
        }

        .title {
            /* AJUSTE: Fonte ligeiramente menor para caber melhor */
            font-size: 48px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 10px;
            margin-bottom: 0;
        }

        .subtitle {
            font-size: 18px;
            color: #d4af37;
            font-weight: bold;
            margin-top: 5px;
            text-transform: uppercase;
        }

        .content {
            font-size: 22px;
            margin-top: 30px;
            line-height: 1.5;
        }

        .name {
            /* AJUSTE: Fonte ajustada para não estourar a linha */
            font-size: 42px;
            font-family: 'Times New Roman', serif;
            font-weight: bold;
            color: #7159c1;
            display: block;
            margin: 15px 0;
            border-bottom: 2px solid #7159c1;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            padding-bottom: 5px;
        }

        .church-name {
            font-weight: bold;
        }

        .footer {
            margin-top: 50px; /* Reduzido para subir o conteúdo */
            font-size: 16px;
            color: #666;
        }

        .signature-area {
            position: absolute;
            bottom: 40px; /* Fixa a assinatura no final do certificado */
            left: 0;
            right: 0;
            text-align: center;
        }

        .signature-line {
            width: 280px;
            border-top: 1px solid #333;
            margin-left: auto;
            margin-right: auto;
        }

        .signature-text {
            font-size: 14px;
            margin-top: 5px;
        }

        .stats {
            margin-top: 15px;
            font-weight: bold;
            color: #d4af37;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="header">
            <div class="title">Certificado de Mérito</div>
            <div class="subtitle">Formação de Acólitos</div>
        </div>

        <div class="content">
            Certificamos com alegria que o acólito <br>
            <span class="name">{{ $name }}</span>
            concluiu com êxito todos os níveis do treinamento litúrgico na <br>
            <span class="church-name">{{ $church }}</span>,
            demonstrando dedicação e conhecimento para o serviço do Altar.
        </div>

        <div class="stats">
            Pontuação Final: {{ $points }} Pontos
        </div>

        <div class="footer">
            Emitido em: {{ $date }}
        </div>

        <div class="signature-area">
            <div class="signature-line"></div>
            <div class="signature-text">Coordenador da Paróquia</div>
        </div>
    </div>
</body>
</html>
