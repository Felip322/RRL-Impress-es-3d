@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
title Atualizar RRL Impressoes 3D no GitHub

cd /d "%~dp0"
set "GIT_CONFIG_COUNT=1"
set "GIT_CONFIG_KEY_0=safe.directory"
set "GIT_CONFIG_VALUE_0=%CD%"

echo.
echo =====================================================
echo   RRL IMPRESSOES 3D - ATUALIZACAO DO GITHUB
echo =====================================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [ERRO] O Git nao esta instalado ou nao esta no PATH.
  goto :falha
)

if not exist ".git" (
  echo [ERRO] Esta pasta nao e um repositorio Git.
  goto :falha
)

echo [1/5] Sincronizando com o GitHub...
git -c http.sslBackend=schannel -c http.version=HTTP/1.1 pull --rebase --autostash origin main
if errorlevel 1 (
  echo [AVISO] A primeira tentativa falhou. Tentando novamente em 3 segundos...
  timeout /t 3 /nobreak >nul
  git -c http.sslBackend=schannel -c http.version=HTTP/1.1 pull --rebase --autostash origin main
  if errorlevel 1 (
    echo.
    echo [ERRO] Nao foi possivel sincronizar com o GitHub apos duas tentativas.
    echo Se aparecer "Connection was reset", confira a internet e execute novamente.
    echo Se aparecer "CONFLICT", resolva o conflito indicado antes de continuar.
    goto :falha
  )
)

echo.
echo [2/5] Testando o projeto...
call npm run build
if errorlevel 1 (
  echo.
  echo [ERRO] O build falhou. Nenhuma alteracao foi enviada.
  goto :falha
)

echo.
echo [3/5] Preparando as alteracoes...
git add -A

for /f "delims=" %%F in ('git diff --cached --name-only -- .env .env.local') do set "ARQUIVO_SECRETO=%%F"
if defined ARQUIVO_SECRETO (
  git restore --staged -- .env .env.local >nul 2>&1
  echo [ERRO] Um arquivo de credenciais foi removido do envio.
  echo Verifique o .gitignore antes de tentar novamente.
  goto :falha
)

git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo Nenhuma alteracao nova para enviar.
  goto :sucesso
)

echo.
echo Arquivos que serao enviados:
git diff --cached --name-status
echo.

set "MENSAGEM=%~1"
if defined MENSAGEM goto :mensagem_pronta
set /p "MENSAGEM=Digite uma descricao curta da alteracao: "
:mensagem_pronta
if not defined MENSAGEM set "MENSAGEM=Atualiza site RRL"

echo.
echo [4/5] Criando a versao: "%MENSAGEM%"
git commit -m "%MENSAGEM%"
if errorlevel 1 goto :falha

echo.
echo [5/5] Enviando para o GitHub...
git -c http.sslBackend=schannel -c http.version=HTTP/1.1 push origin main
if errorlevel 1 (
  echo [AVISO] A primeira tentativa de envio falhou. Tentando novamente em 3 segundos...
  timeout /t 3 /nobreak >nul
  git -c http.sslBackend=schannel -c http.version=HTTP/1.1 push origin main
  if errorlevel 1 (
    echo.
    echo [ERRO] O commit foi criado localmente, mas o envio falhou.
    echo Verifique sua internet ou login do GitHub e execute novamente.
    goto :falha
  )
)

:sucesso
echo.
echo =====================================================
echo   CONCLUIDO COM SUCESSO
echo =====================================================
echo Repositorio atualizado: origin/main
echo.
if /i not "%~2"=="--sem-pausa" pause
exit /b 0

:falha
echo.
echo A atualizacao nao foi concluida.
echo.
if /i not "%~2"=="--sem-pausa" pause
exit /b 1
