
#include "umap.h"
#include <QWebEnginePage>
#include <QWebEngineSettings>

#if (QT_VERSION >= QT_VERSION_CHECK (5, 7, 0))

#    include <QWebEngineProfile>

#endif


UMap::UMap (QWidget *parent)
    : QWebEngineView (parent)
{

#if (QT_VERSION >= QT_VERSION_CHECK (5, 7, 0))

    page ()->profile ()->clearHttpCache ();
    page ()->profile ()->setHttpCacheType (QWebEngineProfile::MemoryHttpCache);

#endif

    setUrl (QUrl (QStringLiteral ("qrc:/html/google_maps.html")));
}

UMap::~UMap ()
{

}


void
UMap::contextMenuEvent (QContextMenuEvent *)
{

}
