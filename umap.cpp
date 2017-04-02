
#include "umap.h"


UMap::UMap (QWidget *parent)
    : QWebEngineView (parent)
{
    setUrl (QUrl (QStringLiteral ("qrc:/html/google_maps.html")));
}

UMap::~UMap ()
{

}

