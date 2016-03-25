/* Layout Engine
==================================================================== */
// Layout a album story from source data
var LayoutEngine = (function () {

  var _rootNode = document.body;
  var _photos;
  var _settings;

  function init(settings, photos) {
    console.log('[LayoutEngine] init');
    // Link _photos to the photo exported from sources
    _photos = photos;
    // Link _settings to the used photo class setting in .css files
    _settings = settings;
  }

  function draw() {
    console.log('[LayoutEngine] draw!');
    if (!_settings) {
      return;
    }

    for (let i = 0 ; i < _photos.length ; i++) {
      // Assign photo id
      _photos[i].id = i;

      // Cover and Table
      if (!i) {
        // Create a cover
        let cover = _createCoverSection(_photos[i], _settings.table.id);
        _rootNode.appendChild(cover);
        // Create a table of content
        let table = _createTableSection(_settings.table.id, _settings.table.title, (i + 1).toString());
        _rootNode.appendChild(table);
        continue;
      }

      // Create contents
      let section = _createContentSection(_photos[i]);
      _rootNode.appendChild(section);
    }
  }

  function _createCoverSection(photo, nextId) {
    let sec = _createSection(_settings.cover.class.section);
    sec.id = photo.id;
    let title = _createTitleWithClass(photo.title, _settings.cover.class.title);
    sec.appendChild(title);
    let desc = _createDescription(photo.description, _settings.cover.class.description);
    sec.appendChild(desc);
    nextId = nextId || (photo.id + 1).toString();
    let nextBtn = _createNextButton(nextId);
    sec.appendChild(nextBtn);
    _setCoverSectionBackground(sec, photo.source);
    return sec;
  }

  function _createTableSection(id, titleStr, nextId) {
    let sec = _createSection(_settings.table.class.section);
    sec.id = id;
    let title = _createTitleWithClass(titleStr, _settings.table.class.title);
    sec.appendChild(title);
    let nextBtn = _createNextButton(nextId);
    sec.appendChild(nextBtn);
    return sec;
  }

  function _createContentSection(photo) {
    let sec = _createSection(_settings.content.class.section);
    sec.id = photo.id;
    let title = _createTitleWithClass(photo.title, _settings.content.class.title);
    sec.appendChild(title);
    let desc = _createDescription(photo.description, _settings.content.class.description);
    sec.appendChild(desc);
    let photoDIV = _createPhotoDIV(photo);
    sec.appendChild(photoDIV);
    // let nextId = ((photo.id + 1)%(_photos.length)).toString();
    // let nextBtn = _createNextButton(nextId);
    // sec.appendChild(nextBtn);
    return sec;
  }

  function _setCoverSectionBackground(section, source) {
    section.style.backgroundImage = 'url(' + source + ')';
    section.style.backgroundSize = 'cover';
    section.style.backgroundAttachment = 'fixed';
    section.style.backgroundPosition = 'center';
    section.style.backgroundRepeat = 'no-repeat';
  }

  function _createTitleWithClass(str, className) {
    return _createHeading1(str, className);
  }

  function _createDescription(str, className) {
    return _createParagraph(str, className);
  }

  function _createPhotoDIV(photo) {
    let photoDIV = _createDiv(_settings.content.class.photo);

    let imgAnchor = _createAnchor(photo.source, '_blank');
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
    let nextAnchor = _createAnchor('#' + nextId, '_self', _settings.nextButton.class.anchor);
    let nextIcon = '<i class="' + _settings.nextButton.icon + '"></i>';
    nextAnchor.innerHTML = nextIcon;
    return nextAnchor;
  }

  function _createDate(date) {
    var dateDIV = _createDiv(_settings.content.class.date);
    var text = document.createTextNode(date);
    dateDIV.appendChild(text);
    return dateDIV;
  }

  function _createSection(className) {
    let section = document.createElement("SECTION");
    if (className) {
      section.className = className;
    }
    return section;
  }

  function _createAnchor(href, target, className) {
    let anchor = document.createElement("A");
    anchor.href = href;
    anchor.target = target || '_self';
    if (className) {
      anchor.className = className;
    }
    return anchor;
  }

  function _createImage(source, className) {
    let img = document.createElement("IMG");
    if (className) {
      img.className = className;
    }
    img.src = source;
    return img;
  }

  function _createDiv(className) {
    let div = document.createElement("DIV");
    if (className) {
      div.className = className;
    }
    return div;
  }

  function _createHeading1(str, className) {
    let text = document.createTextNode(str);
    let h1 = document.createElement("H1");
    if (className) {
      h1.className = className;
    }
    h1.appendChild(text);
    return h1;
  }

  function _createParagraph(str, className) {
    let text = document.createTextNode(str);
    let p = document.createElement("P");
    if (className) {
      p.className = className;
    }
    p.appendChild(text);
    return p;
  }

  return {
    init: init,
    draw: draw,
  };
})();
