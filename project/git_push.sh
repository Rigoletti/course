echo "Добавляю файлы в индексацию..."
git add .

echo "Фиксирую изменения..."
git commit -m "Autocomit"

echo "Отправляем на удалленный репозиторий..."
git push origin "$1"
echo "Готово!"