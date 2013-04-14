basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'assets/js/lib/angular/angular.js',
  'assets/js/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'assets/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
