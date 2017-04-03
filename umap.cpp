#include "umap.h"


UMap::UMap (QWidget *parent)
    : QWebEngineView (parent),
      channel (new QWebChannel (this)),
      qt (new UQt (this))
{
    page ()->setWebChannel (channel);
    channel->registerObject (QStringLiteral ("Qt"), qt);

    setUrl (QUrl (QStringLiteral ("qrc:/html/google_maps.html")));
}


void
UMap::contextMenuEvent (QContextMenuEvent *)
{

}
