import 'dart:io';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../domain/entities/scan_result.dart';
import 'scan_controller.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final ImagePicker _picker = ImagePicker();
  final ScanController _scanController = ScanController();

  File? _selectedImage;
  bool _isLoading = false;

  Future<void> _pickImage(ImageSource source) async {
    final picked = await _picker.pickImage(source: source, imageQuality: 85);

    if (picked != null) {
      setState(() {
        _selectedImage = File(picked.path);
      });

      await _submit();
    }
  }

  Future<void> _submit() async {
    final image = _selectedImage;
    if (image == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      ScanResult result = await _scanController.submit(image);

      if (!mounted) return;

      // Pass ScanResult through `extra` to ScanResultScreen
      context.push(
        '/scan-result',
        extra: result,
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Scan failed: $error')));
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: Stack(
              children: [
                Positioned.fill(
                  child: _selectedImage == null
                      ? Container(color: Colors.black)
                      : Image.file(_selectedImage!, fit: BoxFit.cover),
                ),
                Positioned(
                  top: 16,
                  left: 18,
                  right: 18,
                  child: Row(
                    children: [
                      _CircleTopButton(
                        icon: Icons.close,
                        onTap: () => context.pop(),
                      ),
                      const Spacer(),
                      _CircleTopButton(
                        icon: Icons.flash_on_outlined,
                      ),
                    ],
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      _ScanFrame(),
                      SizedBox(height: 36),
                      Text(
                        'Position item in frame',
                        style: TextStyle(
                          color: Color(0xB3FFFFFF),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                if (_isLoading)
                  Positioned.fill(
                    child: ColoredBox(
                      color: const Color(0x3310B981),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            SizedBox(
                              width: 52,
                              height: 52,
                              child: CircularProgressIndicator(
                                strokeWidth: 3,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(height: 14),
                            Text(
                              'Analyzing Material with AI...',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: Container(
                    height: 152,
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.82),
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(36),
                      ),
                    ),
                    padding: const EdgeInsets.fromLTRB(28, 18, 28, 28),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        _CircleBottomButton(
                          icon: Icons.photo_library_outlined,
                          onTap: _isLoading
                              ? null
                              : () => _pickImage(ImageSource.gallery),
                        ),
                        GestureDetector(
                          onTap: _isLoading
                              ? null
                              : () => _pickImage(ImageSource.camera),
                          child: Container(
                            width: 86,
                            height: 86,
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: Container(
                              decoration: const BoxDecoration(
                                color: Color(0xFFF3F4F6),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.camera_alt_outlined,
                                color: Colors.black,
                                size: 32,
                              ),
                            ),
                          ),
                        ),
                        _CircleBottomButton(
                          icon: Icons.photo_library_outlined,
                          invisible: true,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// === Helper Widgets ===

class _CircleTopButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;

  const _CircleTopButton({required this.icon, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: CircleAvatar(
        radius: 22,
        backgroundColor: Colors.white24,
        child: Icon(icon, color: Colors.white),
      ),
    );
  }
}

class _CircleBottomButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  final bool invisible;

  const _CircleBottomButton({
    required this.icon,
    this.onTap,
    this.invisible = false,
  });

  @override
  Widget build(BuildContext context) {
    if (invisible) return const SizedBox(width: 86, height: 86);
    return GestureDetector(
      onTap: onTap,
      child: CircleAvatar(
        radius: 43,
        backgroundColor: Colors.white24,
        child: Icon(icon, color: Colors.white),
      ),
    );
  }
}

class _ScanFrame extends StatelessWidget {
  const _ScanFrame();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 200,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.blue, width: 3),
      ),
    );
  }
}