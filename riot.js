/*

   Riot.js 0.9.0 | moot.it/riotjs

   (c) 2013 Tero Piirainen, Moot Inc

   @license: MIT

*/
(function(win) {

   // Precompiled templates (JavaScript functions)
   var FN = {},
      slice = [].slice,
      self = this,
      window.R = self;


   // Render a template with data
   self.render = function(template, data) {
      return (FN[template] = FN[template] || Function("_", "return '" +
         template.replace(/^\s+|\s+$|\n/g, "\\n").replace(/\{([^\}]+)\}/g, "'+_.$1+'") + "'")
      )(data);
   }

   // A convenience render method to return a jQuery element
   self.el = function(template, data) {
      return self.render(template, data);
   }

   // A classic pattern for separating concerns
   self.observable = function(obj) {
      var jq = {},
         evTypes = ['on', 'one', 'emit', 'off'];

      for (var i=0, len=evTypes.length; i<len; i++) {
         var name = evTypes[i];
         obj[name] = function(names, fn) {

            if (i < 2) {
               jq[name](names, function(e) {
                  var args = slice.call(arguments, 1)
                  if (names.split(" ")[1]) args.unshift(e.type)
                  fn.apply(obj, args)
               })

            } else if (i == 2) {
               jq.trigger(names, slice.call(arguments, 1));

            } else {
               jq.off(names, fn);
            }

            return obj;
         }
      }

      return obj;
   }

   // emit window.popstate event consistently on page load, on every browser
   var page_popped;

   win.addEventListener("load", function(e) {
      setTimeout(function() {
         if (!page_popped) win.dispatchEvent("popstate")
      }, 1);
   });

   win.addEventListener("popstate", function(e) {
      if (!page_popped) page_popped = true;
   })

   // Change the browser URL or listen to changes on the URL
   self.route = function(to) {

      // listen
      if (typeof to === 'function') {
         win.addEventListener("popstate", function(e, hash) {
            to(hash || location.hash)
         });

      // fire
      } else if (to != location.hash) {
         if (history.pushState) history.pushState("", "", to)
         win.dispatchEvent("popstate", [to]);
      }
   }

})(window)
