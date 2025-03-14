/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 6.8.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtGui/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenu>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *actionSave;
    QAction *actiondas;
    QAction *actionasd;
    QWidget *centralwidget;
    QPushButton *pencilButton;
    QPushButton *eraserButton;
    QWidget *horizontalLayoutWidget;
    QHBoxLayout *horizontalLayout;
    QCheckBox *checkBox_3;
    QCheckBox *checkBox_2;
    QCheckBox *checkBox;
    QMenuBar *menubar;
    QMenu *menuEraser;
    QMenu *menuUndo;
    QStatusBar *statusbar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName("MainWindow");
        MainWindow->resize(800, 600);
        actionSave = new QAction(MainWindow);
        actionSave->setObjectName("actionSave");
        actiondas = new QAction(MainWindow);
        actiondas->setObjectName("actiondas");
        actionasd = new QAction(MainWindow);
        actionasd->setObjectName("actionasd");
        centralwidget = new QWidget(MainWindow);
        centralwidget->setObjectName("centralwidget");
        pencilButton = new QPushButton(centralwidget);
        pencilButton->setObjectName("pencilButton");
        pencilButton->setGeometry(QRect(160, 110, 71, 24));
        eraserButton = new QPushButton(centralwidget);
        eraserButton->setObjectName("eraserButton");
        eraserButton->setGeometry(QRect(60, 230, 80, 24));
        horizontalLayoutWidget = new QWidget(centralwidget);
        horizontalLayoutWidget->setObjectName("horizontalLayoutWidget");
        horizontalLayoutWidget->setGeometry(QRect(510, 0, 291, 51));
        horizontalLayout = new QHBoxLayout(horizontalLayoutWidget);
        horizontalLayout->setObjectName("horizontalLayout");
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        checkBox_3 = new QCheckBox(horizontalLayoutWidget);
        checkBox_3->setObjectName("checkBox_3");

        horizontalLayout->addWidget(checkBox_3);

        checkBox_2 = new QCheckBox(horizontalLayoutWidget);
        checkBox_2->setObjectName("checkBox_2");

        horizontalLayout->addWidget(checkBox_2);

        checkBox = new QCheckBox(horizontalLayoutWidget);
        checkBox->setObjectName("checkBox");

        horizontalLayout->addWidget(checkBox);

        MainWindow->setCentralWidget(centralwidget);
        menubar = new QMenuBar(MainWindow);
        menubar->setObjectName("menubar");
        menubar->setGeometry(QRect(0, 0, 800, 21));
        menuEraser = new QMenu(menubar);
        menuEraser->setObjectName("menuEraser");
        menuUndo = new QMenu(menubar);
        menuUndo->setObjectName("menuUndo");
        MainWindow->setMenuBar(menubar);
        statusbar = new QStatusBar(MainWindow);
        statusbar->setObjectName("statusbar");
        MainWindow->setStatusBar(statusbar);

        menubar->addAction(menuEraser->menuAction());
        menubar->addAction(menuUndo->menuAction());

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QCoreApplication::translate("MainWindow", "MainWindow", nullptr));
        actionSave->setText(QCoreApplication::translate("MainWindow", "Save", nullptr));
        actiondas->setText(QCoreApplication::translate("MainWindow", "das", nullptr));
        actionasd->setText(QCoreApplication::translate("MainWindow", "asd", nullptr));
        pencilButton->setText(QCoreApplication::translate("MainWindow", "Brush", nullptr));
        eraserButton->setText(QCoreApplication::translate("MainWindow", "Eraser", nullptr));
        checkBox_3->setText(QCoreApplication::translate("MainWindow", "Brush", nullptr));
        checkBox_2->setText(QCoreApplication::translate("MainWindow", "Fill", nullptr));
        checkBox->setText(QCoreApplication::translate("MainWindow", "Move", nullptr));
        menuEraser->setTitle(QCoreApplication::translate("MainWindow", "Eraser", nullptr));
        menuUndo->setTitle(QCoreApplication::translate("MainWindow", "Undo", nullptr));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
