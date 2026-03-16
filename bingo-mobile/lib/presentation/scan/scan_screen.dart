import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../domain/entities/scan_result.dart';
import '../session/session_controller.dart';
import '../shared/app_theme.dart';
import 'scan_controller.dart';

class ScanScreen extends ConsumerStatefulWidget {
  const ScanScreen({super.key});

  @override
  ConsumerState<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends ConsumerState<ScanScreen> {
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;

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
    if (image == null) {
      return;
    }

    final userId = await ref.read(sessionControllerProvider.future);
    if (userId == null || userId.isEmpty) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No active session. Please log in again.'),
        ),
      );
      return;
    }

    try {
      final ScanResult result = await ref
          .read(scanControllerProvider.notifier)
          .submit(image, userId);
      if (!mounted) {
        return;
      }
      context.push(
        '/scan-result',
        extra: <String, dynamic>{'result': result, 'imagePath': image.path},
      );
    } catch (error) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Scan failed: $error')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final scanState = ref.watch(scanControllerProvider);

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: Stack(
              children: <Widget>[
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
                    children: <Widget>[
                      _CircleTopButton(
                        icon: Icons.close,
                        onTap: () => context.pop(),
                      ),
                      const Spacer(),
                      const _CircleTopButton(icon: Icons.flash_on_outlined),
                    ],
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: const <Widget>[
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
                if (scanState.isLoading)
                  Positioned.fill(
                    child: ColoredBox(
                      color: const Color(0x3310B981),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: const <Widget>[
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
                      color: Colors.black.withValues(alpha: 0.82),
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(36),
                      ),
                    ),
                    padding: const EdgeInsets.fromLTRB(28, 18, 28, 28),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: <Widget>[
                        _CircleBottomButton(
                          icon: Icons.photo_library_outlined,
                          onTap: scanState.isLoading
                              ? null
                              : () => _pickImage(ImageSource.gallery),
                        ),
                        GestureDetector(
                          onTap: scanState.isLoading
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
                        const _CircleBottomButton(
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

class _ScanFrame extends StatelessWidget {
  const _ScanFrame();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 260,
      height: 260,
      child: Stack(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.55),
                width: 2,
              ),
            ),
          ),
          const Positioned(
            top: -2,
            left: -2,
            child: _Corner(left: true, top: true),
          ),
          const Positioned(
            top: -2,
            right: -2,
            child: _Corner(left: false, top: true),
          ),
          const Positioned(
            bottom: -2,
            left: -2,
            child: _Corner(left: true, top: false),
          ),
          const Positioned(
            bottom: -2,
            right: -2,
            child: _Corner(left: false, top: false),
          ),
          Center(
            child: Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: AppTheme.primary,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Corner extends StatelessWidget {
  const _Corner({required this.left, required this.top});

  final bool left;
  final bool top;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 30,
      height: 30,
      child: CustomPaint(
        painter: _CornerPainter(left: left, top: top),
      ),
    );
  }
}

class _CornerPainter extends CustomPainter {
  const _CornerPainter({required this.left, required this.top});

  final bool left;
  final bool top;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.primary
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 4;

    final hStart = left ? 0.0 : size.width;
    final hEnd = left ? size.width * 0.65 : size.width * 0.35;
    final vStart = top ? 0.0 : size.height;
    final vEnd = top ? size.height * 0.65 : size.height * 0.35;

    canvas.drawLine(Offset(hStart, vStart), Offset(hEnd, vStart), paint);
    canvas.drawLine(Offset(hStart, vStart), Offset(hStart, vEnd), paint);
  }

  @override
  bool shouldRepaint(covariant _CornerPainter oldDelegate) {
    return oldDelegate.left != left || oldDelegate.top != top;
  }
}

class _CircleTopButton extends StatelessWidget {
  const _CircleTopButton({required this.icon, this.onTap});

  final IconData icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: Colors.black.withValues(alpha: 0.24),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white),
      ),
    );
  }
}

class _CircleBottomButton extends StatelessWidget {
  const _CircleBottomButton({
    required this.icon,
    this.onTap,
    this.invisible = false,
  });

  final IconData icon;
  final VoidCallback? onTap;
  final bool invisible;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: invisible ? 0 : 1,
      child: IgnorePointer(
        ignoring: invisible,
        child: GestureDetector(
          onTap: onTap,
          child: Container(
            width: 48,
            height: 48,
            decoration: const BoxDecoration(
              color: Color(0xFF1F2937),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
