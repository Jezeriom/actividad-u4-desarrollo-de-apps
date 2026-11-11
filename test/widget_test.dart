import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app_dev/main.dart';
import 'package:app_dev/screens/home_screen.dart';

void main() {
  testWidgets('Renderiza HomeScreen con título Mis Notas y botón Nueva Nota',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pump();

    expect(find.byType(HomeScreen), findsOneWidget);
    expect(find.text('Mis Notas'), findsOneWidget);
    expect(find.text('Nueva Nota'), findsOneWidget);
    expect(find.byIcon(Icons.add_rounded), findsOneWidget);
  });
}
