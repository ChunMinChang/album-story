/* Layout Engine
==================================================================== */
// Layout a album story from source data
var LayoutEngine = (function () {

  var _rootNode = document.body;
  var _photos;
  var _class;

  function init(classSetting, photos) {
    console.log('[LayoutEngine] init');
    // Link _photos to the photo exported from sources
    _photos = photos;
    // Link _class to the used photo class setting in .css files
    _class = classSetting;
  }

  function draw() {
    console.log('[LayoutEngine] draw!');
    if (!_class) {
      return;
    }

    for (let i = 0 ; i < _photos.length ; i++) {
      _photos[i].id = i;
      let section = (!i)? _createCoverSection(_photos[i]) :
                      (i == 1)? _createTableSection(_photos[i]) :
                        _createContentSection(_photos[i]);
      _rootNode.appendChild(section);
    }
  }

  function _createCoverSection(photo) {
    let sec = _createSectionWithClass(_class.cover.section);
    sec.id = photo.id;
    let title = _createTitleWithClass(photo.title, _class.cover.title);
    let desc = _createDescriptionWithClass(photo.description, _class.cover.description);
    sec.appendChild(title);
    sec.appendChild(desc);
    let nextBtn = _createNextButton((photo.id + 1).toString());
    sec.appendChild(nextBtn);
    _setCoverSectionBackground(sec, photo)
    return sec;
  }

  function _createTableSection(photo) {
    return _createContentSection(photo);
  }

  function _createContentSection(photo) {
    let sec = _createSectionWithClass(_class.content.section);
    sec.id = photo.id;
    let title = _createTitleWithClass(photo.title, _class.content.title);
    let desc = _createDescriptionWithClass(photo.description, _class.content.description);
    sec.appendChild(title);
    sec.appendChild(desc);
    let photoDIV = _createPhotoDIV(photo);
    sec.appendChild(photoDIV);
    // let nextId = ((photo.id + 1)%(_photos.length)).toString();
    // let nextBtn = _createNextButton(nextId);
    // sec.appendChild(nextBtn);
    return sec;
  }

  function _setCoverSectionBackground(section, photo) {
    section.style.backgroundImage = 'url(' + photo.source + ')';
    section.style.backgroundSize = 'cover';
    section.style.backgroundAttachment = 'fixed';
    section.style.backgroundPosition = 'center';
    section.style.backgroundRepeat = 'no-repeat';
  }

  function _createSectionWithClass(className) {
    let section = document.createElement("SECTION");
    section.className += className;
    return section;
  }

  function _createTitleWithClass(str, className) {
    let title = document.createElement("H1");
    title.className += className;
    let text = document.createTextNode(str);
    title.appendChild(text);
    return title;
  }

  function _createDescriptionWithClass(str, className) {
    let para = document.createElement("P");
    para.className += className;
    let text = document.createTextNode(str);
    para.appendChild(text);
    return para;
  }

  function _createPhotoDIV(photo) {
    let photoDIV = _createDivWithClass(_class.content.photo);

    let imgAnchor = _createAnchorWithClass(photo.source, '_blank');
    let photoImg = _createImage(photo.source);
    imgAnchor.appendChild(photoImg);
    photoDIV.appendChild(imgAnchor);

    let date = _createDate(photo.date);
    photoDIV.appendChild(date);

    let nextId = ((photo.id + 1)%(_photos.length)).toString();
    let nextBtn = _createNextButton(nextId);
    photoDIV.appendChild(nextBtn);

    return photoDIV;
  }

  function _createNextButton(nextId) {
    let nextAnchor = _createAnchorWithClass('#' + nextId, '_self', _class.nextButton.anchor);
    let nextIcon = '<i class="' + _class.nextButton.icon + '"></i>';
    nextAnchor.innerHTML = nextIcon;
    return nextAnchor;
  }

  function _createDate(date) {
    var dateDIV = _createDivWithClass(_class.content.date);
    var text = document.createTextNode(date);
    dateDIV.appendChild(text);
    return dateDIV;
  }

  function _createAnchorWithClass(href, target, className) {
    let anchor = document.createElement("A");
    anchor.href = href;

    if (target) {
      anchor.target = target
    }

    if (className) {
      anchor.className += className;
    }

    return anchor;
  }

  function _createImage(source) {
    let img = document.createElement("IMG");
    img.src = source;
    return img;
  }

  function _createDivWithClass(className) {
    let div = document.createElement("DIV");
    div.className += className;
    return div;
  }

  return {
    init: init,
    draw: draw,
  };
})();
