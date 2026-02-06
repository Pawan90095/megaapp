import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ProfileSkeleton extends StatelessWidget {
  const ProfileSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Avatar
            const CircleAvatar(radius: 50, backgroundColor: Colors.white),
            const SizedBox(height: 24),
            
            // TextFields placeholders
            _buildField(),
            const SizedBox(height: 16),
            _buildField(),
            const SizedBox(height: 16),
            _buildField(height: 120), // Bio
            
            const SizedBox(height: 24),
            
            // Section Headers
            _buildSectionHeader(),
            const SizedBox(height: 8),
            _buildListItem(),
            const SizedBox(height: 8),
            _buildListItem(),
          ],
        ),
      ),
    );
  }

  Widget _buildField({double height = 56}) {
    return Container(
      width: double.infinity,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }

  Widget _buildSectionHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Container(width: 100, height: 24, color: Colors.white),
        Container(width: 24, height: 24, color: Colors.white),
      ],
    );
  }

  Widget _buildListItem() {
    return Container(
      width: double.infinity,
      height: 72,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }
}
