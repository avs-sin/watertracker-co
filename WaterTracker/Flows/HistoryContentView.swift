//
//  HistoryContentView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import Charts
import SwiftUI

/// Shows drink intake history
struct HistoryContentView: View {

    @EnvironmentObject var manager: DataManager

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Color.background.ignoresSafeArea()
            VStack(spacing: 15) {
                CustomHeaderView
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        AverageConsumptionView
                        TopDrinksView
                        CustomChartView().environmentObject(manager)
                    }
                    Spacer(minLength: 20)
                }
            }.padding(.horizontal).padding(.top, 5)
        }.onAppear { manager.fetchAllDrinksData() }
    }

    /// Custom header view
    private var CustomHeaderView: some View {
        HStack {
            Text("Drink History").font(.system(size: 24, weight: .semibold))
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

    /// Average consumption
    private var AverageConsumptionView: some View {
        ZStack {
            LinearGradient(colors: [.accentColor.opacity(0.6), .accentColor], startPoint: .topLeading, endPoint: .bottomTrailing).cornerRadius(20.0)
            VStack {
                HStack {
                    Image(systemName: "drop.fill")
                    Text("Fun Facts")
                    Spacer()
                }.font(.system(size: 20, weight: .medium))
                VStack(spacing: 5) {
                    FactListItem(title: "Average volume", value: manager.dailyAverage)
                    FactListItem(title: "Drinks frequency", value: manager.dailyFrequency)
                    FactListItem(title: "Average goal completion", value: manager.dailyCompletion)
                }
            }.padding().foregroundColor(.white)
        }
    }

    /// Fun fact list item
    private func FactListItem(title: String, value: String) -> some View {
        HStack {
            Text(title).font(.system(size: 14, weight: .regular))
            Spacer()
            Text(value).font(.system(size: 17, weight: .medium))
        }
        .lineLimit(1).padding(6).padding(.horizontal, 8)
        .background(Color.primaryText.cornerRadius(8.0).opacity(0.07))
    }

    /// Top drinks
    private var TopDrinksView: some View {
        ZStack {
            Color.secondaryBackground.cornerRadius(20.0)
            VStack {
                HStack {
                    Image(systemName: "trophy.fill")
                    Text("Top Drinks")
                    Spacer()
                }.font(.system(size: 20, weight: .medium))
                HStack(spacing: 15) {
                    ForEach(0..<3, id: \.self) { index in
                        let drink: DrinkType = topDrinks[index]
                        TopDrink(type: drink, value: manager.topDrinks[drink])
                    }
                }
            }.padding().foregroundColor(.primaryText)
        }
    }

    /// Top drinks sorted by count
    private var topDrinks: [DrinkType] {
        manager.topDrinks.sorted(by: { $0.value > $1.value }).compactMap({ $0.key })
    }

    /// Top drink item
    private func TopDrink(type: DrinkType, value: Int?) -> some View {
        ZStack {
            Color.accentColor.cornerRadius(13.0).opacity(0.7)
            ZStack {
                Color.white.cornerRadius(10.0)
                VStack(spacing: -5) {
                    Text(type.emoji).font(.system(size: 40))
                    Text(type.rawValue.capitalized)
                        .font(.system(size: 14, weight: .light))
                }.padding(.vertical, 8)
            }.padding(5).padding(.bottom, 25)
            VStack {
                Spacer()
                Text("\(value ?? 0)").font(.system(size: 16, weight: .medium))
            }.foregroundColor(.white).padding(.bottom, 5)
        }
    }
}

// MARK: - Preview UI
#Preview {
    let manager = DataManager()
    manager.drinksData = chartPreviewData
    manager.fluidUnits = FluidUnit.oz.rawValue
    manager.dailyIntakeGoal = 75.0
    return HistoryContentView().environmentObject(manager)
}
