import Tst from './components/Tst.vue';

document.addEventListener('DOMContentLoaded', function () {
   const tst = new Vue({
      el: '#tst',
      render: (h) => h(Tst),
      components: {
         Tst
      },
   });
});