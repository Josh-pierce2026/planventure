from datetime import datetime, timedelta

def generate_default_itinerary(destination: str, start_date, end_date) -> str:
    """
    Generate a default itinerary template for a trip.
    
    Args:
        destination: The trip destination
        start_date: Trip start date (date object or string)
        end_date: Trip end date (date object or string)
        
    Returns:
        String containing a formatted itinerary template
    """
    # Convert string dates to date objects if needed
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    if isinstance(end_date, str):
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    # Calculate number of days
    num_days = (end_date - start_date).days + 1
    
    # Build itinerary
    itinerary_lines = [
        f"Trip to {destination}",
        f"Duration: {num_days} day{'s' if num_days > 1 else ''}",
        f"Dates: {start_date.strftime('%B %d, %Y')} - {end_date.strftime('%B %d, %Y')}",
        "",
        "Itinerary:",
        ""
    ]
    
    # Generate day-by-day template
    current_date = start_date
    day_number = 1
    
    while current_date <= end_date:
        day_name = current_date.strftime('%A')
        date_str = current_date.strftime('%B %d')
        
        if day_number == 1:
            itinerary_lines.append(f"Day {day_number} - {day_name}, {date_str}: Arrival")
            itinerary_lines.append("  • Check into accommodation")
            itinerary_lines.append("  • Explore local area")
            itinerary_lines.append("  • Welcome dinner")
        elif day_number == num_days:
            itinerary_lines.append(f"Day {day_number} - {day_name}, {date_str}: Departure")
            itinerary_lines.append("  • Final breakfast")
            itinerary_lines.append("  • Check out")
            itinerary_lines.append("  • Travel home")
        else:
            itinerary_lines.append(f"Day {day_number} - {day_name}, {date_str}:")
            itinerary_lines.append("  • Morning: [Add activity]")
            itinerary_lines.append("  • Afternoon: [Add activity]")
            itinerary_lines.append("  • Evening: [Add activity]")
        
        itinerary_lines.append("")
        current_date += timedelta(days=1)
        day_number += 1
    
    # Add additional sections
    itinerary_lines.extend([
        "Notes:",
        "  • [Add any special notes or reminders]",
        "",
        "Packing List:",
        "  • [Add items to pack]",
        "",
        "Emergency Contacts:",
        "  • [Add emergency contact information]"
    ])
    
    return "\n".join(itinerary_lines)

def generate_activity_suggestions(destination: str) -> list:
    """
    Generate activity suggestions based on destination type.
    
    Args:
        destination: The trip destination
        
    Returns:
        List of suggested activities
    """
    # Basic activity categories
    general_activities = [
        "Visit local landmarks and attractions",
        "Try local cuisine and restaurants",
        "Explore museums and galleries",
        "Take a walking tour",
        "Visit markets and shopping areas",
        "Experience local nightlife",
        "Take photos at scenic viewpoints",
        "Relax at parks or beaches"
    ]
    
    # Destination-specific suggestions based on keywords
    destination_lower = destination.lower()
    
    if any(word in destination_lower for word in ['beach', 'island', 'coast', 'tropical']):
        return general_activities + [
            "Water sports and activities",
            "Beach relaxation",
            "Snorkeling or diving",
            "Sunset watching",
            "Boat tours"
        ]
    elif any(word in destination_lower for word in ['mountain', 'alps', 'peak']):
        return general_activities + [
            "Hiking trails",
            "Mountain views",
            "Cable car rides",
            "Nature photography",
            "Outdoor adventures"
        ]
    elif any(word in destination_lower for word in ['city', 'urban', 'metropolis']):
        return general_activities + [
            "City sightseeing",
            "Public transportation experience",
            "Rooftop bars and restaurants",
            "Shopping districts",
            "Theater or shows"
        ]
    else:
        return general_activities
