const sass = require('sass');
const path = require('path');

// Берем путь до папки со стилями точно так же, как в next.config.ts
const stylesPath = path.join(__dirname, 'src', 'shared', 'styles');
console.log('▶ Тестируем пути. Папка со стилями:', stylesPath);

sass.render({
  // Имитируем поведение Next.js: добавляем prependData к пустой строке
  data: `@use "main.scss" as *; \n .test { display: block; }`,
  includePaths: [stylesPath],
  importer: function(url, prev) {
    console.log(`\n🔍 [SASS LOGGER]`);
    console.log(`Ищем: "${url}"`);
    console.log(`Вызвано из: "${prev}"`);
    return null; // null означает "продолжай искать стандартным способом"
  }
}, function(err, result) {
  if (err) {
    console.error('\n❌ ОШИБКА КОМПИЛЯЦИИ:');
    console.error(err.message);
  } else {
    console.log('\n✅ УСПЕШНО! Sass правильно читает пути на Windows.');
  }
});