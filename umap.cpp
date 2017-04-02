
#include "umap.h"
#include <QWebEnginePage>


UMap::UMap (QWidget *parent)
    : QWebEngineView (parent)
{
#if (QT_VERSION >= QT_VERSION_CHECK (5, 7, 0))

    page ()->profile ()->clearHttpCache ();

#endif

    setUrl (QUrl (QStringLiteral ("qrc:/html/google_maps.html")));
}

UMap::~UMap ()
{

}

