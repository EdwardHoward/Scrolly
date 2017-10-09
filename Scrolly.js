var Scrolly = (function () {
    var scrollers = [];

    window.addEventListener('scroll', onScroll, { passive: true });

    function onScroll(){
        for (var i = 0; i < scrollers.length; i++) {

            var scroller = scrollers[i];

            var breakpoint = typeof scroller.breakpoint == 'function' ? scroller.breakpoint() : scroller.breakpoint;
            var divisor = typeof scroller.divisor == 'function' ? scroller.divisor() : scroller.divisor;

            var scrollY = window.scrollY || document.documentElement.scrollTop;
            var percent = (scrollY - breakpoint) / (divisor || 1),
                above = percent < 1,
                below = percent > 0;

            // we only want to do this if it's currently changing size
            // or it went above or below the breakpoint
            if ((above != scroller.lastAbove || below != scroller.lastBelow) || (above && below)) {

                scroller.lastAbove = above;
                scroller.lastBelow = below;

                scroller.onScroll(percent);
            }

        }
    }

    function addScroller(scroller) {
        scrollers.push(scroller);
        onScroll();
    }

    function extend(a, b){
        for(var key in b)
            if(b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }

    return {
        create: function (options) {

            var settings = {
                breakpoint: 0,
                divisor: 1,
                onScroll: function(){}
            }

            extend(settings, options);

            // Just some error handling
            var error = false;
            if (typeof settings.breakpoint !== 'number' && typeof settings.breakpoint !== 'function') {
                console.error("Scrolly: 'breakpoint' needs to be a Number or Function");
                error = true;
            }

            if (typeof settings.divisor !== 'number' && typeof settings.divisor !== 'function') {
                console.error("Scrolly: 'divisor' needs to be a Number or Function");
                error = true;
            }

            if (typeof settings.onScroll !== 'function') {
                console.error("Scrolly: 'onScroll' needs to be a Function");
                error = true;
            }
            if (error) return;

            addScroller({
                breakpoint: settings.breakpoint,
                divisor: settings.divisor,
                onScroll: settings.onScroll,
                lastAbove: false,
                lastBelow: false
            });
        },
        clamp: function(num, max, min) {
            return Math.max(Math.min(max, num), min)
        },
        lerp: function(p, a, b) {
            return b - (b - a) * p;
        }
    }
})();
