QT      +=  webenginewidgets webchannel

SOURCES += main.cpp\
        mapwnd.cpp \
    Rest_sender/request.cpp \
    Rest_sender/requestsender.cpp \
    fbauthwnd.cpp \
    FBApi/Facebook.cpp \
    umap.cpp \
    uqt.cpp

HEADERS  += mapwnd.h \
    Rest_sender/request.h \
    Rest_sender/requestsender.h \
    fbauthwnd.h \
    FBApi/Facebook.h \
    umap.h \
    uqt.h

FORMS    += mapwnd.ui \
    fbauthwnd.ui

# install
target.path = $$[QT_INSTALL_EXAMPLES]/webenginewidgets/contentmanipulation
INSTALLS += target

OTHER_FILES += \
    google_maps.html
    qwebchannel.js


RESOURCES += \
    res.qrc

