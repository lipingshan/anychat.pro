(function() {
    //Load Stylesheet
    var root = 'https://rawgit.com/kachanovskyi/shopchat.pro/master/';
    var head = document.getElementsByTagName('head')[0],
        stylesheet = document.createElement('link');
    stylesheet.type = 'text/css';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = root + 'css/widget.css';
    head.appendChild(stylesheet);

    setTimeout(function() {
        (window.jQuery && init()) || loadScript("https://code.jquery.com/jquery-3.1.1.min.js", init);
    }, 1000);

    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function init() {
        var $ = window.jQuery;

        var settings = {},
            script = $('#shopchat-script'),
            site = window.location.host,
            salt = '\x26\x63\x69\x64\x3D' + Math.round(2147483647 * Math.random()),
            kga = ["aHR0cHM6Ly9zc2wuZ29vZ2xlLWFuYWx5dGljcy5jb20vY29sbGVjdD92PTEmdGlkPVVBLTU1OTEzMzY2LTEz", "JnQ9cGFnZXZpZXcmZGw9", "JnQ9ZXZlbnQmZWM9aW50ZXJhY3Rpb24mZWE9YWN0aXZhdGU="],
            cipher = script.data('apps'),
            align = script.data('align'),
            whitelabel = script.data('whitelabel'),
            colors = {
                email: '#2D70E7',
                sms: '#2F80ED',
                phone: '#0AD02C',
                facebook: '#0084FF',
                viber: '#675CA8',
                kik: '#82BC23',
                whatsapp: '#30BE2D'
            };

        settings.apps = JSON.parse(decodeURI(atob(cipher)));

        settings.tags = {
            page: [atob(kga[0]), atob(kga[1]), site, salt].join(''),
            event: [atob(kga[0]), atob(kga[2]), salt].join('')
        };

        settings.color = script.data('color');
        settings.overlay = script.data('overlay');
        var numberOfApps = Object.keys(settings.apps).length;
        if (!Mobile) {
            if (settings.apps.sms) {
                numberOfApps--;
                console.log('not Mobile if-case (numberOfApps-- for sms)');
            }
        }

        var maxIconCount = Math.floor((window.innerHeight - 130) / 52);

        var anchor = $('<div>')
            .attr('id', 'shopchat-container')
            .appendTo($('body'));

        if (align == 'left') {
            anchor.addClass('left');
        }

        var btnBg = '<svg width="70" height="70" viewBox="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:figma="http://www.figma.com/figma/ns"> <g transform="translate(-991 -671)" figma:type="canvas"> <g figma:type="frame"> <g figma:type="ellipse"> <use xlink:href="#path0_fill" transform="translate(991 671)" fill="' + settings.color + '"/> </g> <g figma:type="vector"> <use xlink:href="#path1_fill" transform="translate(1012.88 695.5)" fill="#FFFFFF"/> </g> </g> </g> <defs> <path id="path0_fill" d="M 70 35C 70 54.33 54.33 70 35 70C 15.67 70 0 54.33 0 35C 0 15.67 15.67 0 35 0C 54.33 0 70 15.67 70 35Z"/> <path id="path1_fill" d="M 26.25 0.909347C 26.25 0.407129 25.8582 0 25.375 0L 7.875 0L 0.875 0C 0.391751 0 0 0.407129 0 0.909347L 0 20.4603L 0 25.3389C 0 26.1099 0.86525 26.5311 1.43516 26.0375L 7.875 20.125L 25.375 20.125C 25.8582 20.125 26.25 19.7179 26.25 19.2157L 26.25 0.909347Z"/> </defs> </svg>';

        var launcher = $('<div>')
            .addClass('shopchat-launcher')
            .addClass('shopchat-effect')
            .css( 'background-image', 'url(data:image/svg+xml,' + escape(btnBg) + ')')
            .css('background-color', settings.color)
            .appendTo(anchor);

        var ua = navigator.userAgent;
        var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        var Android = !!ua.match(/Android/i);
        var Mobile = !!ua.match(/Mobi/i);
        var Mac = !!ua.match(/Macintosh/i);

        $.get(settings.tags.page);



        //Add overlay

        console.log(settings, 'settings out if');
        if (settings.overlay && !Mobile) {
            console.log(settings.overlay, 'settings.overlay');
            var overlayMask = $('<div id="shopchat-overlay">').appendTo($('body')).click(function() {
                overlayMask.hide();
            }).hide();

            overlayBody = $('<div>').addClass('overlay-body').appendTo(overlayMask).click(function(event) {
                event.stopPropagation();
            });

            $.each(settings.apps, function(key, value) {
                console.log(settings, 'settings');
                console.log(settings.apps, 'apps');
                console.log(key, 'key');
                $('<div>')
                    .addClass('shopchat-overlay-chat-icon')
                    .attr('data-type', key)
                    .css('background-color', colors[key])
                    .append(
                        $('<img>')
                        .attr('src', root + 'images/' + key + '.svg')
                        .attr('alt', key)
                    )
                    .append($('<div class="shopchat-label">').text(key.charAt(0).toUpperCase() + key.slice(1)))

                .appendTo(overlayBody);
            });

            launcher.click(function() {
                overlayMask.fadeIn();
                console.log('launcher click');
            });

        } else {
            $.each(settings.apps, function(key, value) {
                if (Mobile || (key != 'sms' && key != 'kakao')) {
                    $('<div>')
                        .addClass('shopchat-chat-icon')
                        .attr('data-type', key)
                        .css('background-color', colors[key])
                        .append(
                            $('<img>')
                            .attr('src', root + 'images/' + key + '.svg')
                            .attr('alt', key)
                        )
                        .append($('<div class="shopchat-label">').text(key.charAt(0).toUpperCase() + key.slice(1)))
                        .css('color', colors[key])
                        .hide()
                        .appendTo(anchor);
                }
            });

            //Add a more icon
            var more = $('<div>')
                .css('background-color', '#888888')
                .addClass('shopchat-chat-icon')
                .attr('data-type', 'more')
                .append(
                    $('<img>')
                    .attr('src', root + 'images/' + 'more' + '.svg')
                    .attr('alt', 'more')
                        .css('transform', 'scale(-1,1)')
                )
                // .append($('<div class="shopchat-label">').text('More').css('color', 'white'))
                .hide()
                .click(function() {
                    anchor.find('.shopchat-chat-icon').each(function(index, img) {
                        img = $(img);

                        if (index <= numberOfApps - maxIconCount) {
                            if (img.is(':visible')) {
                                img.animate({
                                    'bottom': "",
                                    'right': "",
                                    'opacity': 0
                                }, 'fast', function() {
                                    img.hide();
                                });

                            } else {
                                //Setting
                                var option = {
                                    'opacity': 1,
                                    'bottom': 72 + index % maxIconCount * 52
                                };

                                option[(align == 'left' ? 'left' : 'right')] = 52 + 16 + Math.floor(index / maxIconCount) * 52;
                                option[(align == 'left' ? 'right' : 'left')] = "auto";
                                img.show().animate(option, 'fast');
                            }
                        }
                    });
                });

            if (numberOfApps > maxIconCount) {
                more.appendTo(anchor);
            }

            $(window).resize(function() {
                maxIconCount = Math.floor((window.innerHeight - 130) / 52);
                if (numberOfApps > maxIconCount) {
                    more.appendTo(anchor);
                } else {
                    more.detach();
                }
            });


            launcher.click(function() {
                $('#shopchat-container > .shopchat-chat-icon').each(function(index, img) {
                    img = $(img);
                    if (launcher.is('.shopchat-launcher-active')) {
                        img.animate({
                            'bottom': 20,
                            'right': 16,
                            'opacity': 0
                        }, 'fast', function() {
                            img.css('right', '')
                                .css('bottom', '')
                                .hide();
                        });

                    } else {
                        if (numberOfApps > maxIconCount) {
                            if (index > numberOfApps - maxIconCount) {
                                img.show().animate({
                                    'opacity': 1,
                                    'bottom': 72 + (maxIconCount - ((numberOfApps - index) % maxIconCount) - 1) * 52
                                }, 'fast');
                            }
                        } else {
                            img.show().animate({
                                'opacity': 1,
                                'bottom': 80 + index * 62
                            }, 'fast');
                        }
                    }
                });

                if (!launcher.is('.shopchat-launcher-active')) {
                    $.get(settings.tags.event);
                }

                launcher.toggleClass('shopchat-launcher-active');
            });
        }

        $('.shopchat-chat-icon, .shopchat-overlay-chat-icon').each(function(index, icon) {
            var link, qr, app = $(icon);
            var container = $('<div>').addClass('shopchat-qr');
            switch (app.data('type')) {
                case 'email':
                    link = "mailto:" + settings.apps.email;
                    break;
                case 'sms':
                    link = "sms:" + settings.apps.sms;
                    break;
                case 'phone':
                    if (Mobile) {
                        link = "tel:" + settings.apps.phone;
                    } else {
                        container.css('color', 'white').css('padding', '8px').css('padding-top', '32px');
                        $('<a target="_blank" class="shopchat-button">').attr('href', "tel://" + settings.apps.phone).text(settings.apps.phone).appendTo(container);
                        qr = true;
                        break;
                    }
                    break;
                case 'facebook':
                    if (iOS) {
                        link = "fb-messenger://user-thread/" + settings.apps.facebook;
                    } else if (Android) {
                        link = "fb-messenger://user/" + settings.apps.facebook;
                    } else if (!Mobile) {
                        link = "https://m.me/" + settings.apps.facebook;
                    }
                    break;
                case 'whatsapp':
                    var name = site.split('.')[0];
                    var card = "BEGIN:VCARD" +
                        "\nVERSION:3.0" +
                        "\nN:" + name +
                        "\nFN:" + name +
                        "\nORG:" + site +
                        "\nTEL;TYPE=WORK,VOICE:" + settings.apps.whatsapp +
                        "\nEND:VCARD";

                    container.css('color', 'white').css('padding', '8px').css('padding-top', '32px').text("1: Add to Contacts")

                    if (true || Android) {
                        $('<a target="_blank" class="shopchat-button">').attr('href', "tel:" + settings.apps.whatsapp).text(settings.apps.whatsapp).appendTo(container);
                    } else  {
                        $('<a target="_blank" class="shopchat-button">').attr('rel', 'external').attr('download', name + ".vcf").attr('href', "data:text/directory;base64," + btoa(card)).text(settings.apps.whatsapp).appendTo(container);
                    }

                    $('<br><span>').text('2: Start chat').appendTo(container);

                    if (Mobile) {
                        $('<br><a class="shopchat-button" href="whatsapp://send?text=Hi">Open Whatsapp</a>').appendTo(container);
                    } else {
                        $('<br><a class="shopchat-button" target="_blank" href="https://web.whatsapp.com">Open Whatsapp</a>').appendTo(container);
                    }

                    qr = true;
                    break;

                case 'viber':
                    var name = site.split('.')[0];
                    var card = "BEGIN:VCARD" +
                        "\nVERSION:3.0" +
                        "\nN:" + name +
                        "\nFN:" + name +
                        "\nORG:" + site +
                        "\nTEL;TYPE=WORK,VOICE:" + settings.apps.viber +
                        "\nEND:VCARD";

                    container.css('color', 'white').css('padding', '8px').css('padding-top', '32px').text("1: Add to Contacts");

                    if (true || Android) {
                        $('<a target="_blank" class="shopchat-button">').attr('href', "viber://tel:" + settings.apps.viber).text(settings.apps.viber).appendTo(container);
                    } else if (iOS) {
                        $('<a target="_blank" class="shopchat-button">').attr('href', "viber://calls").text(settings.apps.viber).appendTo(container);
                    } else {
                        $('<a target="_blank" class="shopchat-button">').attr('rel', 'external').attr('download', name + ".vcf").attr('href', "data:text/directory;base64," + btoa(card)).text(settings.apps.viber).appendTo(container);
                    }

                    $('<br><span>').text('2: Start chat').appendTo(container);

                    if (Mobile || Android) {
                        $('<br><a class="shopchat-button" href="viber://forward?text=Hello">Open Viber</a>').appendTo(container);
                    }
                    // else if (iOS) {
                    //     $('<br><a class="shopchat-button" href="viber://chats">Open Viber</a>').appendTo(container);
                    // }
                    else {
                        $('<br><a class="shopchat-button" target="_blank" href="https://viber.com">Viber Website</a>').appendTo(container);
                    }

                    qr = true;
                    break;

                case 'kik':
                    if (Mobile || iOS) {
                        link = "kik://user/" + settings.apps.kik;
                    }
                    // else if (Android) {
                    //     link = "fb-messenger://user/" + settings.apps.facebook;
                    // }
                    else if (!Mobile) {
                        link = "https://www.kik.com/";
                    }
                    break;
                default:
                    break;
            }

            if (qr) {
                app.append(container);
            }

            app.click(function(event) {
                event.stopPropagation();

                if (qr) {
                    if (app.is('.shopchat-panel')) {
                        app.removeClass('shopchat-panel');
                        app.find('.shopchat-qr').removeClass('active');
                    } else {
                        app.siblings().removeClass('shopchat-panel');
                        app.addClass('shopchat-panel');
                        app.find('.shopchat-qr').addClass('active');
                    }
                }

                if (link) {
                    app.siblings().removeClass('shopchat-panel');

                    if (Mobile) {
                        window.location = link;
                    } else {
                        var a = $('<a>').attr('target', '_blank').attr('href', link);
                        a.appendTo(anchor)[0].click();
                        a.detach();
                    }
                }
            });
        });

        window.initializeShopchat = init;
        return true;
    }
})();
