# Usando a imagem do Node.js 20
FROM node:20-alpine

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos de dependências do projeto para o contêiner
COPY ./package*.json ./

# Instalar dependências do projeto
RUN npm install

RUN npx expo install

# Copiar o restante do código da aplicação para o contêiner
COPY ./ ./

# Expor a porta 8081 para o servidor de desenvolvimento do Expo
EXPOSE 8081

# Comando para iniciar o Expo usando a porta 8081
CMD ["npx", "expo", "start", "--tunnel", "--port", "8081"]
