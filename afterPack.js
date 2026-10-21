const path = require('path');
module.exports = async function (context) {
  const { rcedit } = await import('rcedit');
  const exe = path.join(context.appOutDir, context.packager.appInfo.productFilename + '.exe');
  await rcedit(exe, {
    icon: path.join(context.packager.projectDir, 'Assets', 'logodbd.ico'),
    'version-string': { ProductName: 'DBD Tournament', FileDescription: 'DBD Tournament' },
  });
};
