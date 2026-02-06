import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

class QrScreen extends StatelessWidget {
  final String slug;
  final String fullName;

  const QrScreen({super.key, required this.slug, required this.fullName});

  @override
  Widget build(BuildContext context) {
    // Use backend redirect URL for dynamic tracking
    // For Android Emulator -> Host Backend: 10.0.2.2:3000
    // In Production: 'https://api.yourdomain.com/q/$slug'
    final String backendHost = '10.0.2.2:3000'; 
    final String profileUrl = 'http://$backendHost/q/$slug';

    return Scaffold(
      appBar: AppBar(
        title: Text('Your QR Code', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              fullName,
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              '@$slug',
              style: GoogleFonts.outfit(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: QrImageView(
                data: profileUrl,
                version: QrVersions.auto,
                size: 250.0,
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Scan to view profile',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
