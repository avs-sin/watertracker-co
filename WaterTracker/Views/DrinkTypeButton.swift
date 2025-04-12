//
//  DrinkTypeButton.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI

/// Shows a drink type button item
struct DrinkTypeButton: View {

    let type: DrinkType?
    let fontSize: Int
    let iconSize: Int
    let cornerRadius: Double
    let lineWidth: Int
    let padding: Double
    let selected: Bool

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Color.secondaryBackground.overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(lineWidth: CGFloat(lineWidth)).foregroundColor(.accentColor)
                    .opacity(selected ? 1.0 : 0.0)
            )
            VStack {
                if let emoji = type?.emoji {
                    Text(emoji).font(.system(size: Double(iconSize)))
                } else {
                    Image(systemName: "plus").foregroundColor(.accentColor)
                        .font(.system(size: Double(iconSize)))
                }
                Spacer()
                Text(type?.rawValue.capitalized ?? "More")
                    .font(.system(size: Double(fontSize)))
                    .foregroundStyle(.primaryText).lineLimit(1)
            }.multilineTextAlignment(.center).padding(.vertical, padding)
        }.cornerRadius(cornerRadius)
    }
}

// MARK: - Preview UI
#Preview {
    DrinkTypeButton(type: nil, fontSize: 20,
                    iconSize: 60, cornerRadius: 40.0,
                    lineWidth: 5, padding: 100.0, selected: true)
}
