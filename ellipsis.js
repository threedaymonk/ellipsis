Ellipsis = {

  getElementsByClassName: function(cl) {
    var retnode = [];
    var myclass = new RegExp('\\b'+cl+'\\b');
    var elem = document.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
      var classes = elem[i].className;
      if (myclass.test(classes)) retnode.push(elem[i]);
    }
    return retnode;
  },

  trySquishing: function(element) {
    for (var factor = 1.0; factor > 0.3 && element.clientHeight > element.targetHeight; factor -= 0.1) {
      var spacing = '-'+(1-factor)+'pt';
      element.style.letterSpacing = spacing;
    }
    if (element.clientHeight > element.targetHeight) {
      element.style.letterSpacing = '0';
      return false;
    } else {
      return true;
    }
  },

  tryTruncating: function(element) {
    var content = element.fullContent;
    var min = 0;
    var max = parseInt(content.length / 2);
    var l;
    var truncate = function(element, content, size){
      return content.substr(0, size) + '…' + content.substr(content.length - size, size);
    }

    while ((max - min) > 1) {
      l = parseInt(min + (max - min) / 2);
      element.innerHTML = truncate(element, content, l);
      if (element.clientHeight > element.targetHeight) {
        max = l;
      } else {
        min = l;
      }
    }
    element.innerHTML = truncate(element, content, min);
  },
  
  goodFit: function(element) {
    return (element.clientHeight <= element.targetHeight);
  },

  update: function(){
    var elements = Ellipsis.getElementsByClassName('ellipsis');
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (typeof element.fullContent == 'undefined') {
        element.fullContent = element.innerHTML;
        element.innerHTML = 'M';
        element.targetHeight = element.clientHeight;
        element.innerHTML = element.fullContent;
        element.style.height = 'auto';
        element.style.overflow = 'visible';
      } else {
        element.innerHTML = element.fullContent;
        element.style.letterSpacing = null;
        element.label = null;
      }
      Ellipsis.goodFit(element) || Ellipsis.trySquishing(element) || Ellipsis.tryTruncating(element);
    }
  }
};
