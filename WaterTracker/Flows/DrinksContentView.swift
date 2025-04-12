//
//  DrinksContentView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI

/// Shows a grid of drinks
struct DrinksContentView: View {

    @EnvironmentObject var manager: DataManager
    private let gridSpacing: Double = 12.0

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Color.background.ignoresSafeArea()
            VStack(spacing: 20) {
                CustomHeaderView
                ScrollView(showsIndicators: false) {
                    LazyVGrid(columns: columns, spacing: gridSpacing) {
                        ForEach(DrinkType.allCases) { type in
                            DrinkGridItem(type: type)
                        }
                    }
                }
            }.padding(.horizontal).padding(.top, 5)
        }
    }

    /// Custom header view
    private var CustomHeaderView: some View {
        HStack {
            Text("Choose a drink").font(.system(size: 24, weight: .semibold))
            Spacer()
            Button {
                manager.fullScreenMode = nil
            } label: {
                Image(systemName: "xmark").padding(8)
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    .background(Circle().foregroundStyle(.secondaryBackground))
            }
        }
    }

    /// Drink item in the grid
    private func DrinkGridItem(type: DrinkType) -> some View {
        let isPremiumDrink: Bool = !manager.isPremiumUser && !AppConfig.freeDrinks.contains(type)
        return Button {
            manager.selectedDrink = type
            manager.selectedRecentDrink = type
        } label: {
            ZStack {
                DrinkTypeButton(type: type, fontSize: 17, iconSize: 40,
                                cornerRadius: 15, lineWidth: 5, padding: 20,
                                selected: manager.selectedDrink == type)
                .frame(height: 130)
                if isPremiumDrink {
                    VStack {
                        HStack {
                            Spacer()
                            Image(systemName: "lock.circle.fill")
                        }.foregroundColor(.primaryText)
                        Spacer()
                    }.padding(10)
                }
            }.opacity(isPremiumDrink ? 0.5 : 1.0)
        }.disabled(isPremiumDrink)
    }

    /// Grid columns configuration
    private var columns: [GridItem] {
        Array(repeating: GridItem(spacing: gridSpacing), count: 3)
    }
}

// MARK: - Preview UI
#Preview {
    DrinksContentView().environmentObject(DataManager())
}
