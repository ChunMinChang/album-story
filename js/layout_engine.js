/* Layout Engine
==================================================================== */
// Layout a album story from source data
var LayoutEngine = (function () {

  var _rootNode = document.body;
  var _photos;
  var _settings;
  var _debug = false;

  function init(settings, photos) {
    _log('init');
    // Link _photos to the photo exported from sources
    _photos = photos;
    // Link _settings to the used photo class setting in .css files
    _settings = settings;
  }

  function draw() {
    _log('draw!');
    if (!_settings) {
      return;
    }

    for (let i = 0 ; i < _photos.length ; i++) {
      // Assign photo id
      _photos[i].id = i;

      // Generate Cover and Table
      if (!i) {
        // If there is no table needed to be generated
        if (!_settings.table) {
          let cover = _createCoverSection(_photos[i]);
          _rootNode.appendChild(cover);
          continue;
        }

        // Otherwise, we need to generate a table for our content
        let tableId = (_photos.length).toString();

        // Create a cover
        let cover = _createCoverSection(_photos[i], tableId);
        _rootNode.appendChild(cover);

        // Create a table of content
        let nextId = (i + 1).toString();
        let table = _createTableSection(tableId, _settings.table.title, nextId);
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
    let desc = _createDescription(photo.description,
                                  _settings.cover.class.description);
    sec.appendChild(desc);
    nextId = nextId || (photo.id + 1).toString();
    let nextBtn = _createNextButton(nextId);
    sec.appendChild(nextBtn);
    _setCoverSectionBackground(sec, photo.source);
    return sec;
  }

  function _createTableSection(id, name, nextId) {
    let sec = _createSection(_settings.table.class.section);
    sec.id = id;
    let title = _createTitleWithClass(name, _settings.table.class.title);
    sec.appendChild(title);

    let containerDIV = _createDiv(_settings.table.class.container);
    // _photos[0] is cover background,
    // so it's no need to put it into the table of content
    for (let i = 1 ; i < _photos.length ; i++) {
      _photos[i].id = i;
      let photoDIV = _createPhotoInTable(_photos[i]);
      containerDIV.appendChild(photoDIV);
    }
    sec.appendChild(containerDIV);

    let nextBtn = _createNextButton(nextId);
    sec.appendChild(nextBtn);
    return sec;
  }

  function _createContentSection(photo) {
    let sec = _createSection(_settings.content.class.section);
    sec.id = photo.id;

    let title = _createTitleWithClass(photo.title,
                                      _settings.content.class.title);
    sec.appendChild(title);

    let desc = _createDescription(photo.description,
                                  _settings.content.class.description);
    sec.appendChild(desc);

    let photoDIV = _createPhotoContent(photo);
    sec.appendChild(photoDIV);

    let nextId = ((photo.id + 1)%(_photos.length)).toString();
    let nextBtn = _createNextButton(nextId);
    sec.appendChild(nextBtn);

    if (photo.inList) {
      _insertPhotoToMenu(photo.id ,photo.title);
    }

    return sec;
  }

  function _insertPhotoToMenu(id ,title) {
    if (_settings.bootstrap &&
        _settings.bootstrap.menu &&
        _settings.bootstrap.itemHTML) {
      let menu = document.getElementsByClassName(_settings.bootstrap.menu)[0];
      let itemHTML = _settings.bootstrap.itemHTML.sample.replace(
        _settings.bootstrap.itemHTML.link, id.toString());
      itemHTML = itemHTML.replace(_settings.bootstrap.itemHTML.name, title);
      menu.innerHTML += itemHTML;
    }
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

  function _createPhotoInTable(photo) {
    let photoDIV = _createDiv(_settings.table.class.photo);
    let imgAnchor = _createAnchor('#' + photo.id, '_self',
                                  _settings.bootstrap.scroll);
    let photoImg = _createImage(photo.source);
    imgAnchor.appendChild(photoImg);
    photoDIV.appendChild(imgAnchor);

    return photoDIV;
  }

  function _createPhotoContent(photo) {
    let photoDIV = _createDiv(_settings.content.class.photo);

    let imgAnchor = _createAnchor(photo.source, '_blank');
    let photoImg = _createImage(photo.source);
    imgAnchor.appendChild(photoImg);
    
    photoDIV.appendChild(imgAnchor);

    let date = _createDate(photo.date);
    photoDIV.appendChild(date);

    return photoDIV;
  }

  function _createNextButton(nextId) {
    let buttonDIV = _createDiv(_settings.nextButton.class.container);
    let nextAnchor = _createAnchor('#' + nextId, '_self',
                                   _settings.nextButton.class.anchor +
                                   ' ' + _settings.bootstrap.scroll);
    nextAnchor.innerHTML = _settings.nextButton.iconHTML;
    buttonDIV.appendChild(nextAnchor);

    return buttonDIV;
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

  function _log(msg) {
    _debug && console.log('[LayoutEngine] ' + msg);
  }

  return {
    init: init,
    draw: draw,
  };
})();
