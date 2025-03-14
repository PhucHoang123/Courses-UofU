#include "mainwindow.h"
#include "ui_mainwindow.h"
#include<QDebug>
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , pixleEditor(new PixleEditor(this))  // Initialize PixleEditor
{
    ui->setupUi(this);

    // Connect buttons to set the tool in PixleEditor
    connect(ui->pencilButton, &QPushButton::clicked, this, [=]() {
        pixleEditor->setTool("Pencil");
        //qDebug() << "Pencil tool selected.";
    });

    connect(ui->eraserButton, &QPushButton::clicked, this, [=]() {
        pixleEditor->setTool("Eraser");
        //qDebug() << "Eraser tool selected.";
    });
}

MainWindow::~MainWindow()
{
    delete ui;
    delete pixleEditor;
}
