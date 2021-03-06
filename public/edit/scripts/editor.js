// Generated by CoffeeScript 2.5.1
(function() {
  // http://stackoverflow.com/a/901144/84283
  var Editor, getGistUrl, getParameterByName, initializeHelp, initializeUndoRedo, updateControls;

  getParameterByName = function(name) {
    var regex, regexS, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regexS = "[\\?&]" + name + "=([^&#]*)";
    regex = new RegExp(regexS);
    results = regex.exec(window.location.search);
    if (results == null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  };

  getGistUrl = function(id) {
    return `https://api.github.com/gists/${id}`;
  };

  initializeHelp = function() {
    var updateHelp;
    updateHelp = function() {
      if ($.cookie('help') === "hidden") {
        $("#help").css("display", "none");
        return $("#help-icon").css("display", "block");
      } else {
        $("#help").css("display", "block");
        return $("#help-icon").css("display", "none");
      }
    };
    updateHelp();
    $("#help .dismiss").on("click", function() {
      $.cookie('help', 'hidden', {
        expires: 30
      });
      return updateHelp();
    });
    return $("#help-icon .open").on("click", function() {
      $.cookie('help', 'shown', {
        expires: 30
      });
      return updateHelp();
    });
  };

  updateControls = function() {
    if ((typeof cmxref !== "undefined" && cmxref !== null ? cmxref.undoStack.length : void 0) > 0) {
      $("#undo-button").attr("disabled", null);
    } else {
      $("#undo-button").attr("disabled", "disabled");
    }
    if ((typeof cmxref !== "undefined" && cmxref !== null ? cmxref.redoStack.length : void 0) > 0) {
      return $("#redo-button").attr("disabled", null);
    } else {
      return $("#redo-button").attr("disabled", "disabled");
    }
  };

  initializeUndoRedo = function() {
    $("#undo-button").on("click", function() {
      if (typeof cmxref !== "undefined" && cmxref !== null) {
        cmxref.undo();
      }
      return updateControls();
    });
    return $("#redo-button").on("click", function() {
      if (typeof cmxref !== "undefined" && cmxref !== null) {
        cmxref.redo();
      }
      return updateControls();
    });
  };

  window.messageFromCMX = function(event, cmx) {
    switch (event) {
      case 'cmx:ready':
        window.cmxref = cmx;
        cmx.makeEditable();
        return updateControls();
    }
  };

  Editor = class Editor {
    constructor() {
      this.setupAce();
      this.$picker = $('#file-picker');
      this.$picker.on('change', (event) => {
        return this.selectFile(this.$picker.val());
      });
      this.$apply = $('#apply');
      this.$apply.on('click', () => {
        this.saveFile();
        return this.ace.focus();
      });
    }

    setupAce() {
      var config, path, session;
      this.ace = ace.edit("editor");
      config = require("ace/config");
      config.set("packaged", true);
      path = "scripts/ace";
      config.set("modePath", path);
      config.set("themePath", path);
      this.ace.setTheme("ace/theme/chrome");
      this.ace.setShowPrintMargin(false);
      this.ace.setShowInvisibles(true);
      this.ace.setDisplayIndentGuides(false);
      this.ace.setShowFoldWidgets(false);
      session = this.ace.getSession();
      session.setUseSoftTabs(true);
      session.setUseWrapMode(true);
      session.setTabSize(2);
      session.setFoldStyle("manual");
      session.setMode("ace/mode/html");
      return this.ace.commands.addCommand({
        name: 'Save Changes',
        bindKey: {
          win: 'Ctrl-S',
          mac: 'Command-S'
        },
        exec: () => {
          this.saveFile();
          return true;
        }
      });
    }

    updateFromModel(model) {
      this.updateFilePicker(model);
      return this.selectFile(0);
    }

    updateFilePicker(model) {
      var i, item, len, results1, title, unit, unit_index;
      this.$picker.empty();
      this.files = [];
      unit_index = 0;
      results1 = [];
      for (i = 0, len = model.length; i < len; i++) {
        unit = model[i];
        unit_index++;
        results1.push((function() {
          var j, len1, ref, results2;
          ref = unit.items;
          results2 = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            item = ref[j];
            if (!item.content) {
              continue;
            }
            this.files.push(item);
            title = `${this.files.length}. ${item.title()}`;
            results2.push(this.$picker.append($("<option/>").val(this.files.length - 1).text(title)));
          }
          return results2;
        }).call(this));
      }
      return results1;
    }

    fileTypeToAceMode(type) {
      return `ace/mode/${type}`;
    }

    setContent(content) {
      var pos;
      pos = this.ace.getCursorPosition();
      this.ace.setValue(content, 1);
      return this.ace.moveCursorToPosition(pos);
    }

    saveFile() {
      var $floater, $stage, content, doc, editor, interval, old, oldScrollTop, setup;
      content = this.ace.getValue();
      editor = this;
      old = $(".stage-floater");
      $stage = $("<iframe/>", {
        "class": "stage",
        frameborder: 0,
        allowTransparency: "true"
      });
      $floater = $("<div/>", {
        "class": "stage-floater"
      });
      $floater.append($stage);
      $("#stage-wrapper").prepend($floater);
      oldScrollTop = old.find("iframe").contents().find('body').scrollTop();
      doc = $stage.contents().get(0);
      doc.open();
      doc.write(content);
      doc.close();
      setup = function() {
        var e, invocations, ref, set, throttle, win;
        throttle = function(fn) {
          return _.debounce(fn, 500);
        };
        win = $stage.get(0).contentWindow || ((ref = $stage.get(0).contentDocument) != null ? ref.defaultView : void 0);
        try {
          set = win.$(doc).find('body');
        } catch (error) {
          e = error;
          set = {
            length: 0
          };
        }
        if (set.length === 0) {
          return false;
        }
        invocations = 0;
        set.css("min-height", "1000px").scrollTop(oldScrollTop);
        setInterval(function() {
          return set.css("min-height", "");
        }, 200);
        set.on('cmx:updated', throttle(function() {
          var chunks, patched;
          updateControls();
          invocations++;
          if (invocations === 1) {
            return;
          }
          console.log("update code");
          chunks = [];
          win.$(doc).find("scene").each(function() {
            var $scene, html, model;
            $scene = win.$(this);
            model = $scene.data('cmx-model');
            model.serialize();
            html = $('<div>').append($scene.clone()).html();
            return chunks.push(html);
          });
          content = editor.ace.getValue();
          patched = content.replace(/<scene(.|[\r\n])+?\/scene>/mg, function() {
            return chunks.shift();
          });
          return editor.setContent(patched);
        }));
        return true;
      };
      interval = setInterval(function() {
        if (setup()) {
          return clearInterval(interval);
        }
      }, 50);
      return setTimeout(function() {
        return old.fadeOut(300, function() {
          return $(this).remove();
        });
      }, 200);
    }

  };

  $(function() {
    var editor, env, hash, src;
    Modernizr.Detectizr.detect();
    env = Modernizr.Detectizr.device;
    if (env.browserEngine === "webkit" || $.cookie("letmein")) {
      $(".supported").css("display", "block");
    } else {
      $("#pass-button").on("click", function() {
        $.cookie("letmein", "now!", {
          expires: 30
        });
        return window.location.reload();
      });
      $(".unsupported").css("display", "block");
      return;
    }
    if (env.os === "mac") {
      $('#apply').append(" (CMD+S)");
    } else {
      $('#apply').append(" (CTRL+S)");
    }
    initializeHelp();
    initializeUndoRedo();
    updateControls();
    console.log("editor started");
    editor = new Editor();
    window.cmxEditor = editor;
    src = getParameterByName("src");
    hash = "?";
    if (!src) {
      hash = window.location.hash.substring(1);
      if (hash) {
        src = getGistUrl(hash);
      } else {
        src = window.location.href + "sample.html";
      }
    }
    $(document).ajaxError(function(event, ...args) {
      $(".supported").css("display", "none");
      $(".error").css("display", "block");
      $('#error-response').text(args[0].responseText);
      $('#error-gist-number').text('#' + hash);
      $('#error-gist-link').attr('href', src).text(src);
      $('#error-gist-index-link').attr('href', `https://gist.github.com/${hash}`);
      return console.log("failed to fetch content", args);
    });
    console.log(`fetching ${src}...`);
    return $.get(src, function(content) {
      var ref, ref1, target;
      console.log("got", content);
      target = src;
      if (typeof content === "object") {
        target = content.html_url;
        content = (ref = content.files) != null ? (ref1 = ref["index.html"]) != null ? ref1.content : void 0 : void 0;
      }
      $('#targetFile').attr('href', target).text(target);
      editor.setContent(content);
      editor.saveFile();
      console.log("editor ready");
      return $('#desk').css('display', 'block');
    });
  });

}).call(this);
