
#include "umap.h"
#include <QWebFrame>


UMap::UMap (QWidget *parent)
    : QWebView (parent)
{
    qt = new UQt (this);

    page ()->mainFrame ()->addToJavaScriptWindowObject ("Qt", qt);
    setUrl (QUrl (QStringLiteral ("qrc:/html/google_maps.html")));
}

UMap::~UMap ()
{

}

