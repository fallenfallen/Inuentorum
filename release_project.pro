QT      +=  webenginewidgets

SOURCES += main.cpp\
        mapwnd.cpp \
    Rest_sender/request.cpp \
    Rest_sender/requestsender.cpp

HEADERS  += mapwnd.h \
    Rest_sender/request.h \
    Rest_sender/requestsender.h

FORMS    += mapwnd.ui

# install
target.path = $$[QT_INSTALL_EXAMPLES]/webenginewidgets/contentmanipulation
INSTALLS += target

OTHER_FILES += \
    google_maps.html

RESOURCES += \
    res.qrc

