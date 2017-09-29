function renderTOC(toc) {
    $('#toc').html(
        parseList(toc, 0)
    );
}

function renderDoc(path) {
    $.get('doc/' + path + '.md', function (doc) {
        $('#doc').html(
            markdown.toHTML(doc)
        )
    })
}

function parseList(conf, tier) {
    var html = '';
    html += "<ul class='tier tier-" + tier + "'>";
    $.each(conf, function (i, item) {
        if (item.path) {
            html += "<li class='link' data-path='" + item.path + "'><a href='javascript:void(0);'>";
        } else if (item.link) {
            html += "<li class='link'><a href='" + item.link + "'>";
        } else {
            html += "<li><a>";
        }
        html += item.name + "</a></li>";
        if (item.next) {
            html += parseList(item.next, tier + 1)
        }
    });
    html += "</ul>";
    return html;
}


$(function () {
    $.get('TOC.conf', function (toc) {
        renderTOC(
            JSON.parse(toc)
        )
    })
});
$('#toc').on('click', '.link', function () {
    var path = $(this).data('path');
    if (path) {
        $('.link').removeClass('active');
        $(this).addClass('active');
        renderDoc(path)
    }
});
